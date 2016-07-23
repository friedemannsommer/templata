const path = require('path')
const process = require('process')
const express = require('express')
const webpack = require('webpack')
const config = require('./webpack.config')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

const app = new express()
const compiler = webpack(config)
const serverConfig = {
    ip: process.env.IP || 'localhost',
    port: process.env.PORT || 8080
}

// webpack
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

// vendor (react)
app.use('/static', express.static(path.join(__dirname, 'node_modules')))

// default response
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

// start server on configured ip:port
app.listen(serverConfig.port, serverConfig.ip, (error) => {
    if (error) {
        console.error(error)
    } else {
        console.info(`Listening on %s:%s`, serverConfig.ip, serverConfig.port)
    }
})