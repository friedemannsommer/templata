const path = require('path')
// eslint-disable-next-line import/no-extraneous-dependencies
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config')

module.exports = merge.smart({
    entry: {
        templata: path.join(__dirname, 'src', 'template.ts')
    }
}, baseConfig)
