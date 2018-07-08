/*jshint esversion: 6 */
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path');
var node_modules_dir = path.resolve(__dirname, 'node_modules');

module.exports = {
    entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].bundle.js',
        publicPath: '/',
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            utils: path.resolve(__dirname, 'src', 'utils'),
            core: path.resolve(__dirname, 'src', 'core')
        }
    },
    externals: {
        jQuery: 'jQuery',
        jquery: 'jQuery',
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            },
            {
                test: /\.js?$/,
                include: [
                    path.resolve(__dirname, 'js'),
                    path.resolve(node_modules_dir, '@platform/wp-modules'),
                ],
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['es2015', {
                                'modules': false
                            }],
                            'babel-preset-stage-2',
                        ]
                    }
                }]
            },  {
                test: /\.(jpe?g|png|gif)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        name: '[path][name].[ext]',
                        limit: 8960,
                        outputPath: function (url) {
                            if (url.indexOf('imgs/') === 0) {
                                url = url;
                            } else {
                                url = 'imgs/' + url;
                            }
                            return url.replace(/node\_modules/g, 'lib');
                        },
                        publicPath: function (url) {
                            if (url.indexOf('imgs/') === 0) {
                                url = `../${url}`;
                            } else {
                                url = '../imgs/' + url;
                            }
                            return url.replace(/node\_modules/g, 'lib');
                        },
                        fallback: 'file-loader',
                    }
                }]
            }, {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    use: [{
                        loader: require.resolve('css-loader'),
                        options: {
                            importLoaders: 1,
                            // module: true,
                        },
                    }, {
                        loader: require.resolve('postcss-loader'),
                        options: {
                            // Necessary for external CSS imports to work
                            // https://github.com/facebookincubator/create-react-app/issues/2677
                            ident: 'postcss',
                            plugins: () => [
                                require('postcss-flexbugs-fixes'),
                                autoprefixer({
                                    browsers: [
                                        '>1%',
                                        'last 4 versions',
                                        'Firefox ESR',
                                        'not ie < 8',
                                    ],
                                    flexbox: 'no-2009',
                                }),
                                require('postcss-assets')({
                                    loadPaths: ['/imgs']
                                }),
                            ],
                        },
                    }
                    ]
                })
            }, {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: require.resolve('css-loader'),
                        options: {
                            importLoaders: 1,
                            // module: true,
                        },
                    }, {
                        loader: require.resolve('postcss-loader'),
                        options: {
                            ident: 'postcss',
                            plugins: () => [
                                require('postcss-flexbugs-fixes'),
                                autoprefixer({
                                    browsers: [
                                        '>1%',
                                        'last 4 versions',
                                        'Firefox ESR',
                                        'not ie < 8',
                                    ],
                                    flexbox: 'no-2009',
                                }),
                                require('postcss-assets')({
                                    loadPaths: ['/imgs']
                                }),
                            ],
                        },
                    }, {
                        loader: 'sass-loader'
                    }
                    ]
                })
            }]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: (getPath) => {
                return getPath('css/[name].css');
            },
            allChunks: true
        }),
        new HtmlWebpackPlugin({
            title: 'three',
            filename: 'index.html',
            template: './index.html',
            inject: true,
        }),
    ]
}