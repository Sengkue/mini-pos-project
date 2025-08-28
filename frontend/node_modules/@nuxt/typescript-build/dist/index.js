"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const defu_1 = require("defu");
const consola_1 = __importDefault(require("consola"));
const defaults = {
    ignoreNotFoundWarnings: false,
    typeCheck: true
};
const tsModule = function (moduleOptions) {
    // Combine options
    const options = (0, defu_1.defu)(this.options.typescript, moduleOptions, defaults);
    // Change color of CLI banner
    this.options.cli.bannerColor = 'blue';
    if (!this.options.extensions.includes('ts')) {
        this.options.extensions.push('ts');
    }
    // Extend Builder to handle .ts/.tsx files as routes and watch them
    this.options.build.additionalExtensions = ['ts', 'tsx'];
    if (options.ignoreNotFoundWarnings) {
        this.options.build.warningIgnoreFilters.push(warn => warn.name === 'ModuleDependencyWarning' && /export .* was not found in /.test(warn.message));
    }
    this.extendBuild((config, { isClient, isModern }) => {
        config.resolve.extensions.push('.ts', '.tsx');
        const jsxRuleLoaders = config.module.rules.find(r => r.test.test('.jsx')).use;
        const babelLoader = jsxRuleLoaders[jsxRuleLoaders.length - 1];
        config.module.rules.push(...['ts', 'tsx'].map(ext => ({
            test: new RegExp(`\\.${ext}$`, 'i'),
            use: [
                babelLoader,
                {
                    loader: 'ts-loader',
                    options: Object.assign({ transpileOnly: true, appendTsxSuffixTo: ext === 'tsx' ? [/\.vue$/] : [] }, (options.loaders && options.loaders[ext]))
                }
            ]
        })));
        if (options.typeCheck && isClient && !isModern) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
            const logger = consola_1.default.withTag('nuxt:typescript');
            /* istanbul ignore next */
            const loggerInterface = {
                log(message) { logger.log(message); },
                info(message) { logger.info(message); },
                error(message) { logger.error(message); }
            };
            config.plugins.push(new ForkTsCheckerWebpackPlugin((0, defu_1.defu)(options.typeCheck, {
                typescript: {
                    configFile: path_1.default.resolve(this.options.rootDir, 'tsconfig.json'),
                    extensions: {
                        vue: true
                    }
                },
                logger: {
                    issues: loggerInterface
                }
            })));
        }
    });
};
exports.default = tsModule;
//# sourceMappingURL=index.js.map