/*jshint esversion: 6 */
const webpack = require('webpack');
const merge = require('webpack-merge');
const base = require('./webpack.config');
const uglify = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(base, {
    mode: 'production',
    plugins: [
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'production',
            DEBUG: false
        }),
        new uglify({
            uglifyOptions: {
                output: {
                    // 最紧凑的输出
                    beautify: false,
                },
                compress: {
                    // 删除所有的 `console` 语句
                    // 还可以兼容ie浏览器
                    drop_console: true,
                }
            }
        }),
        new BundleAnalyzerPlugin()
    ]
});