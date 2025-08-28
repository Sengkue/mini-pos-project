const { User } = require('../models');
const { validationResult } = require('express-validator');
const logger = require('../config/logger');
const { Op } = require('sequelize');

class UserController {
  // Get all users
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10, search, role, isActive } = req.query;
      const offset = (page - 1) * limit;

      const whereClause = {};
      
      if (search) {
        whereClause[Op.or] = [
          { username: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { firstName: { [Op.iLike]: `%${search}%` } },
          { lastName: { [Op.iLike]: `%${search}%` } }
        ];
      }

      if (role) {
        whereClause.role = role;
      }

      if (isActive !== undefined) {
        whereClause.isActive = isActive === 'true';
      }

      const { rows: users, count } = await User.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']],
        attributes: { exclude: ['password'] }
      });

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: count,
            totalPages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      logger.error('Get all users error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get user by ID
  async getById(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      logger.error('Get user by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Create new user
  async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { username, email, password, firstName, lastName, role, phone } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [
            { email: email },
            { username: username }
          ]
        }
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'User with this email or username already exists'
        });
      }

      const user = await User.create({
        username,
        email,
        password,
        firstName,
        lastName,
        role: role || 'cashier',
        phone
      });

      logger.info(`User ${user.username} created by ${req.user.username}`);

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: { user: user.toJSON() }
      });
    } catch (error) {
      logger.error('Create user error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update user
  async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const { username, email, firstName, lastName, role, phone, isActive } = req.body;

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if email or username is already taken by another user
      if (email || username) {
        const whereClause = {
          id: { [Op.ne]: id }
        };

        if (email && username) {
          whereClause[Op.or] = [
            { email: email },
            { username: username }
          ];
        } else if (email) {
          whereClause.email = email;
        } else if (username) {
          whereClause.username = username;
        }

        const existingUser = await User.findOne({ where: whereClause });

        if (existingUser) {
          return res.status(409).json({
            success: false,
            message: 'Email or username already taken by another user'
          });
        }
      }

      const updateData = {};
      if (username !== undefined) updateData.username = username;
      if (email !== undefined) updateData.email = email;
      if (firstName !== undefined) updateData.firstName = firstName;
      if (lastName !== undefined) updateData.lastName = lastName;
      if (role !== undefined) updateData.role = role;
      if (phone !== undefined) updateData.phone = phone;
      if (isActive !== undefined) updateData.isActive = isActive;

      await user.update(updateData);

      logger.info(`User ${user.username} updated by ${req.user.username}`);

      res.json({
        success: true,
        message: 'User updated successfully',
        data: { user: user.toJSON() }
      });
    } catch (error) {
      logger.error('Update user error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete user (soft delete)
  async delete(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Prevent deletion of own account
      if (user.id === req.user.id) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete your own account'
        });
      }

      // Soft delete by setting isActive to false
      await user.update({ isActive: false });

      logger.info(`User ${user.username} deactivated by ${req.user.username}`);

      res.json({
        success: true,
        message: 'User deactivated successfully'
      });
    } catch (error) {
      logger.error('Delete user error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get user statistics
  async getStats(req, res) {
    try {
      const totalUsers = await User.count();
      const activeUsers = await User.count({ where: { isActive: true } });
      const inactiveUsers = await User.count({ where: { isActive: false } });
      
      const usersByRole = await User.findAll({
        attributes: [
          'role',
          [User.sequelize.fn('COUNT', User.sequelize.col('id')), 'count']
        ],
        where: { isActive: true },
        group: ['role'],
        raw: true
      });

      res.json({
        success: true,
        data: {
          total: totalUsers,
          active: activeUsers,
          inactive: inactiveUsers,
          byRole: usersByRole
        }
      });
    } catch (error) {
      logger.error('Get user stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Reset user password
  async resetPassword(req, res) {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;

      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters long'
        });
      }

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      user.password = newPassword;
      await user.save();

      logger.info(`Password reset for user ${user.username} by ${req.user.username}`);

      res.json({
        success: true,
        message: 'Password reset successfully'
      });
    } catch (error) {
      logger.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = new UserController();