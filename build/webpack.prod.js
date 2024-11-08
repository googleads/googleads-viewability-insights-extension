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

const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');

const optimizationOptions = {
  minimize: true,
  minimizer: [
    new TerserPlugin({
      terserOptions: {
        compress: {
          pure_funcs: [
            'console.log',
            'console.info',
            'console.debug',
            'console.warn'
          ]
        },
      },
    }),
  ],
}

module.exports = [
  merge(common.devtoolsPageConfig, {
    mode: 'production',
    optimization: optimizationOptions,
  }),
  merge(common.panelPageConfig, {
    mode: 'production',
    optimization: optimizationOptions,
  }),
  merge(common.contentScriptConfig, {
    mode: 'production',
    optimization: optimizationOptions,
  }),
  merge(common.adRequestDetailsSidebarConfig, {
    mode: 'production',
    optimization: optimizationOptions,
  }),
  merge(common.gptIntegrationScriptConfig, {
    mode: 'production',
    optimization: optimizationOptions,
  }),
];
