// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");

const isProduction = process.env.NODE_ENV == "production";

const { VueLoaderPlugin } = require('vue-loader')

const config = {
	entry: "./src/index.ts",
	output: {
		path: path.resolve(__dirname, "dist"),
	},
	devServer: {
		open: true,
		host: "localhost",
	},
	plugins: [
		// Add your plugins here
		// Learn more about plugins from https://webpack.js.org/configuration/plugins/
		new VueLoaderPlugin()
	],
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/i,
				loader: "ts-loader",
				exclude: ["/node_modules/"],
				options: {
					appendTsSuffixTo: [/\.vue$/]
				}
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
				type: "asset",
			},
			{
				test: /\.vue$/,
				loader: "vue-loader",
			},
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.scss$/,
				use: ['style-loader', 'css-loader', 'sass-loader']
			},
			// Add your rules for custom modules here
			// Learn more about loaders from https://webpack.js.org/loaders/
		],
	},
	resolve: {
		extensions: [".tsx", ".ts", ".jsx", ".js", ".vue", "..."],
	},
};

module.exports = () => {
	if (isProduction) {
		config.mode = "production";
	} else {
		config.mode = "development";
	}
	return config;
};
