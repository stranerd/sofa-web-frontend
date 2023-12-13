const path = require("path");
module.exports = {
	runtimeCompiler: true,
	css: {
		loaderOptions: {
			/* sass: {
				additionalData: `
         @import '@/application/assets/styles/global.scss';
        `
			} */
		}
	},

	configureWebpack: {
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
				"@modules": path.resolve('./node_modules/sofa-modules/src/modules'),
				"@utils": path.resolve('./node_modules/sofa-modules/src/utils'),
			},
			extensions: ['.js', '.vue', '.json', '.ts']
		}
	},
	chainWebpack: config => {
		config.module
		.rule('vue')
		.use('vue-loader')
			.tap((options) => {
				options.compilerOptions ??= {}
				options.compilerOptions.isCustomElement = (tag) => {
					return ['math-field'].includes(tag)
				}
				return options
			})
	}
}