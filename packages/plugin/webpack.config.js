const path = require('path');
const DESTINATION = path.resolve(__dirname, 'dist');

module.exports = {
	devtool: 'inline-source-map',
	entry: {
		index: './src/index.ts',
		'content-script': './src/content-script/content-script.ts',
		'ng-devtools': './src/injected/ng-devtools.ts',
		devtools: './src/devtools/devtools.ts',
		background: './src/background/background.ts',
		popup: './src/popup/popup.ts'
	},
	output: {
		filename: '[name].bundle.js',
		path: DESTINATION
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js']
	}
};
