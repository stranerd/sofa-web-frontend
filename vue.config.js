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
				"@/*": path.resolve(__dirname, "./src"),
				vue: path.resolve('./node_modules/vue')
			},
			extensions: ['.js', '.vue', '.json', '.ts']
		}
	}
}