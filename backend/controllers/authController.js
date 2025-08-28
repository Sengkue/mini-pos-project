const { User } = require('../models');
const { generateToken, generateRefreshToken, verifyRefreshToken } = require('../middleware/auth');
const { validationResult } = require('express-validator');
const logger = require('../config/logger');

class AuthController {
  // User login
  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { email, password } = req.body;

      // Find user by email or username
      const user = await User.findOne({
        where: {
          $or: [
            { email: email },
            { username: email }
          ],
          isActive: true
        }
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Validate password
      const isPasswordValid = await user.validatePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate tokens
      const token = generateToken(user);
      const refreshToken = generateRefreshToken(user);

      logger.info(`User ${user.username} logged in successfully`);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: user.toJSON(),
          token,
          refreshToken
        }
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // User registration
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { username, email, password, firstName, lastName, role } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        where: {
          $or: [
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

      // Create new user
      const userData = {
        username,
        email,
        password,
        firstName,
        lastName,
        role: role || 'cashier'
      };

      const user = await User.create(userData);

      // Generate tokens
      const token = generateToken(user);
      const refreshToken = generateRefreshToken(user);

      logger.info(`New user ${user.username} registered successfully`);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: user.toJSON(),
          token,
          refreshToken
        }
      });
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Refresh token
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token is required'
        });
      }

      const user = await verifyRefreshToken(refreshToken);
      
      const newToken = generateToken(user);
      const newRefreshToken = generateRefreshToken(user);

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          token: newToken,
          refreshToken: newRefreshToken
        }
      });
    } catch (error) {
      logger.error('Refresh token error:', error);
      res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }
  }

  // Get current user profile
  async getProfile(req, res) {
    try {
      const user = req.user;
      
      res.json({
        success: true,
        data: {
          user: user.toJSON()
        }
      });
    } catch (error) {
      logger.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update user profile
  async updateProfile(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const user = req.user;
      const { firstName, lastName, phone } = req.body;

      // Update allowed fields
      await user.update({
        firstName,
        lastName,
        phone
      });

      logger.info(`User ${user.username} updated profile`);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: user.toJSON()
        }
      });
    } catch (error) {
      logger.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Change password
  async changePassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const user = req.user;
      const { currentPassword, newPassword } = req.body;

      // Validate current password
      const isCurrentPasswordValid = await user.validatePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      logger.info(`User ${user.username} changed password`);

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      logger.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Logout (mainly for logging purposes)
  async logout(req, res) {
    try {
      const user = req.user;
      
      logger.info(`User ${user.username} logged out`);

      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      logger.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Verify token (health check for authentication)
  async verifyToken(req, res) {
    try {
      const user = req.user;
      
      res.json({
        success: true,
        message: 'Token is valid',
        data: {
          user: user.toJSON()
        }
      });
    } catch (error) {
      logger.error('Verify token error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = new AuthController();