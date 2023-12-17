const path = require("path");
module.exports = {
	runtimeCompiler: true,

	css: {
		loaderOptions: {
			sass: {
				additionalData: `
         @import '@/application/assets/styles/global.scss';
        `
			}
		}
	},

	configureWebpack: {
		resolve: {
			alias: {
				'@modules': path.join(__dirname, './src/modules'),
				'@utils': path.join(__dirname, './src/utils')
			},
			extensions: ['.js', '.vue', '.json', '.ts']
		}
	}
}