const path = require('path')
const webpack = require('webpack')

module.exports = {
    target: 'web',
    devtool: 'source-map',
    entry: {
        templata: path.join(__dirname, 'src', 'template.ts')
    },
    output: {
        path: path.join(__dirname, 'dist', 'browser'),
        filename: '[name].js',
        sourceMapFilename: '[name].map',
        chunkFilename: '[hash].chunk.js',
        publicPath: '/dist/browser/',
        libraryTarget: 'umd',
        library: 'Templata'
    },
    resolve: {
        root: path.join(__dirname, 'client', 'src'),
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js', '.ts']
    },
    module: {
        preLoaders: [
            {
                test: /\.ts$/,
                exclude: /node_modules$/,
                loader: 'tslint'
            }
        ],
        loaders: [
            {
                test: /\.ts$/,
                exclude: /node_modules|\.d\.ts$/,
                loader: 'ts-loader'
            }
        ]
    },
    plugins: [
        new webpack.optimize.DedupePlugin()
    ]
}
