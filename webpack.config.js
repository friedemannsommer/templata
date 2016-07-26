const path = require('path')
const webpack = require('webpack')

module.exports = {
    entry: {
        client: path.join(__dirname, 'src', 'template.ts')
    },
    output: {
        path: path.join(__dirname, 'dist', 'browser'),
        filename: 'templata.js',
        libraryTarget: 'var',
        library: 'Templata',
    },
    resolve: {
        extensions: ['', '.ts']
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loaders: ['ts-loader']
            }
        ]
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.DedupePlugin()
    ]
}