const { sentryWebpackPlugin } = require("@sentry/webpack-plugin");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { DefinePlugin } = require("webpack");

const ORGANIZATION = "amazing-co-r2";
const PROJECT = "javascript-react";
const RELEASE = `${PROJECT}@${Date.now()}`;

module.exports = {
	entry: "./src/index.jsx",

	output: {
		filename: "bundle.js",
		path: __dirname + "/dist",
	},

	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
				},
			},
		],
	},

	plugins: [
		new HtmlWebpackPlugin({
			template: "./public/index.html",
			filename: "index.html",
		}),
		sentryWebpackPlugin({
			authToken: process.env.SENTRY_AUTH_TOKEN,
			org: ORGANIZATION,
			project: PROJECT,
			release: RELEASE,
        }),
        new DefinePlugin({
            RELEASE: JSON.stringify(RELEASE),
            ENVIRONMENT: JSON.stringify("production"),
        }),
	],

	devServer: {
		port: 3000,
	},

	devtool: "source-map",
};
