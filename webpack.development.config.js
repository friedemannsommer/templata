const path = require('path')
// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack')
// eslint-disable-next-line import/no-extraneous-dependencies
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config')

module.exports = merge.merge(baseConfig, {
    mode: 'development',
    entry: {
        templata: [
            'webpack-dev-server/client?http://localhost:8080',
            'webpack/hot/only-dev-server',
            path.resolve(__dirname, './src/template.ts')
        ]
    },
    output: {
        chunkFilename: '[hash].chunk.js',
        publicPath: '/dist/browser/'
    },
    devServer: {
        contentBase: path.join(__dirname),
        hot: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
})
