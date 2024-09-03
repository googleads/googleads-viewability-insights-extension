/**
 * @license Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

exports.devtoolsPageConfig = {
  name: 'devtools_page',
  target: 'web',
  entry: {
    devtools_page: './src/devtools_page.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'assets/devtools_page.html',
      filename: '[name].html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/manifest.json' },
        { from: './assets/images'},
      ],
    }),
  ],
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, '..', 'dist'),
    filename: '[name].js',
  },
};

exports.panelPageConfig = {
  name: 'panel_page',
  target: 'web',
  entry: {
    panel_page: ['./src/panel/panel_page.js'],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new HtmlWebpackPlugin({
      template: 'assets/panel/panel_page.html',
      filename: '[name].html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, '..', 'dist'),
    filename: '[name].js',
  },
};

exports.adRequestDetailsSidebarConfig = {
  name: 'ad_request_details',
  target: 'web',
  entry: {
    ad_request_details: ['./src/sidebar/ad_request_details.js'],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new HtmlWebpackPlugin({
      template: 'assets/sidebar/ad_request_details.html',
      filename: '[name].html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, '..', 'dist'),
    filename: '[name].js',
  },
};

exports.contentScriptConfig = {
  name: 'content_script',
  target: 'web',
  entry: {
    content_script: './src/content_script/content_script.js',
  },
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, '..', 'dist'),
    filename: '[name].js',
  },
};

exports.gptIntegrationScriptConfig = {
  name: 'gpt_integration_script',
  target: 'web',
  entry: {
    gpt_integration_script: './src/gpt/gpt_integration_script.js',
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: './assets/gpt_integration_script.css' }],
    }),
  ],
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, '..', 'dist'),
    filename: '[name].js',
    library: 'ViewabilityInsights',
    libraryTarget: 'window',
    libraryExport: 'default',
  },
};
