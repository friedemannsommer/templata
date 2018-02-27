const path = require('path')
// eslint-disable-next-line import/no-extraneous-dependencies
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config')

module.exports = merge.smart({
    entry: {
        'templata-compiler': path.join(__dirname, 'src', 'lib', 'compiler.ts')
    }
}, baseConfig)
