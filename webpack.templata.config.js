const path = require('path')
// eslint-disable-next-line import/no-extraneous-dependencies
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config')

module.exports = merge.merge(baseConfig, {
    entry: {
        templata: path.resolve(__dirname, './src/template.ts')
    }
})
