const path = require('path')

module.exports = {
    mode: 'production',
    target: 'web',
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, 'dist', 'browser'),
        filename: '[name].js',
        sourceMapFilename: '[name].map',
        libraryExport: 'default',
        libraryTarget: 'umd',
        library: 'Templata'
    },
    resolve: {
        modules: [
            path.join(__dirname, 'client', 'src'),
            'node_modules'
        ],
        extensions: ['.js', '.ts']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules|\.d\.ts$/,
                loader: 'ts-loader'
            }
        ]
    }
}
