const path = require('path')
const webpack = require('webpack')

module.exports = {
    target: 'web',
    devtool: 'source-map',
    entry: {
        templata: [
            'webpack-dev-server/client?http://localhost:8080',
            'webpack/hot/only-dev-server',
            path.join(__dirname, 'src', 'template.ts')
        ]
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
    devServer: {
        contentBase: path.join(__dirname),
        historyApiFallback: true,
        hot: true
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
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.DefinePlugin(
            {
                'process.env': {
                    NODE_ENV: '"development"'
                }
            }
        )
    ]
}