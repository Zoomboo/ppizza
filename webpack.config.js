const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const PUBLIC_PATH = '/';
const VERSION = 212

const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');

module.exports = {

    mode: "development",
    entry: {
        app: './src/js/index.js'
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: true
    },
    module: {
        rules: [{
            test: /\.(html)$/,
            use: {
                loader: 'html-loader',
                options: {}
            }
        },
        {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        },
        {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: [
                'file-loader'
            ]
        },
        {
            test: /\.(png|svg|jpg|mp3|gif)$/,
            use: [
                'file-loader'
            ]
        }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',

        }),

        new CleanWebpackPlugin,
        new HtmlWebpackPlugin({
            title: 'Pizza App',
            template: './src/index.html'
        }),

        new SWPrecacheWebpackPlugin({
            cacheId: 'my-domain-cache-id-' + VERSION,
            dontCacheBustUrlsMatching: /\.\w{8}\./,
            filename: 'service-worker.js',
            minify: true,
            navigateFallback: PUBLIC_PATH + 'index.html',
            staticFileGlobsIgnorePatterns: [/\.map$/, /manifest\.json$/]
        }),
        new WebpackPwaManifest({
            name: 'G-Pizza',
            short_name: 'G-Pizza',
            description: 'G-Pizza',
            display: "fullscreen",
            version: VERSION,
            background_color: '#FAFAFA',
            theme_color: '#FFF',
            'theme-color': '#FFF',
            start_url: '/',
            icons: [{
                src: path.resolve('src/img/logo2.png'),
                sizes: [96, 128, 192, 256, 384, 512],
                destination: path.join('assets', 'icons')
            }]
        }),
    ],
    output: {
        filename: '[name].bundle.js?v=' + VERSION,
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    optimization: {
        /*  minimize: true,
         minimizer: [new UglifyJsPlugin({
             include: /\.min\.js$/
         })] */
    },
    resolve: {
        alias: {
            $: 'jquery',
            '$': 'jquery',
            jquery: 'jquery',

            jQuery: 'jquery',
            'window.jquery': 'jquery',
            'window.jQuery': 'jquery'

        }
    }
};