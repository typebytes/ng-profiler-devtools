const path = require('path');
const DESTINATION = path.resolve(__dirname, 'dist');

module.exports = {
	entry: {
		index: './src/index.ts'
	},
	output: {
		filename: '[name].js',
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
		extensions: ['.ts', '.js']
	}
};
