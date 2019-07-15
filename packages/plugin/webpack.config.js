const path = require('path');
const DESTINATION = path.resolve(__dirname, 'dist');

module.exports = {
    entry: {
        'content-script': './src/content-script/content-script.ts',
        'rx-devtools': './src/injected/rx-devtools.ts',
        'devtools': './src/devtools/devtools.ts',
        'background': './src/background/background.ts'
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
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
};
