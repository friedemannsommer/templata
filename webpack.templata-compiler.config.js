const path = require('path')
const webpack = require('webpack')

module.exports = {
    target: 'web',
    devtool: 'source-map',
    entry: {
        'templata-compiler': path.join(__dirname, 'src', 'lib', 'compiler.ts')
    },
    output: {
        path: path.join(__dirname, 'dist', 'browser'),
        filename: '[name].js',
        sourceMapFilename: '[name].map',
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
