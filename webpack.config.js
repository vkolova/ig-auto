const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: ['./src/index.jsx'],
    output: {
        path: path.resolve(__dirname, 'public/dist'),
        filename: 'app.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin({
            filename: "styles.css"
        })
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.s?css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(jpg|png|gif)$/,
                loader: 'url-loader',
                options: {
                    limit: 25000,
                    name: 'images/[name].[ext]'
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json']
    },
    devServer: {
        static : path.join(__dirname, 'public'),
        compress: false,
        port: 3000,
        historyApiFallback: true
    },
    devtool: 'source-map'
}