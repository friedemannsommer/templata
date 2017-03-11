const path = require('path')
const baseConfig = require('./webpack.base.config')

module.exports = Object.assign(baseConfig, {
    entry: {
        'templata-compiler': path.join(__dirname, 'src', 'lib', 'compiler.ts')
    }
})
