const path = require('path')
const baseConfig = require('./webpack.base.config')

module.exports = Object.assign(baseConfig, {
    entry: {
        templata: path.join(__dirname, 'src', 'template.ts')
    }
})
