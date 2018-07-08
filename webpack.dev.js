const base = require('./webpack.config');
const path = require('path');
const merge = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = merge(base, {
    mode: 'development',
    devtool: '#eval-source-map',
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 9000
    },
    plugins:[
        new BundleAnalyzerPlugin()
    ]
});