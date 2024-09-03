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

/**
 * @author mbordihn@google.com (Markus Bordihn)
 * @file Defines and creates the Chrome dev tools panel.
 */

import typescriptEslint from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      '**/build',
      '**/coverage',
      '**/dist',
      '**/global.d.ts',
      '**/node_modules',
    ],
  },
  ...compat.extends(
    'eslint:recommended',
    'plugin:jsdoc/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:compat/recommended',
  ),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...Object.fromEntries(
          Object.entries(globals.serviceworker).map(([key]) => [key, 'off']),
        ),
        console: true,
        DEVMODE: false,
        VERSION: false,
        ViewabilityInsights: true,
        chrome: true,
        globalThis: false,
        googletag: true,
        MessageEvent: true,
        serviceWorkerOption: true,
        window: true,
      },

      parser: tsParser,
      ecmaVersion: 2024,
      sourceType: 'module',
    },

    settings: {},

    rules: {
      'no-unused-vars': [
        2,
        {
          args: 'after-used',
          argsIgnorePattern: '^opt_',
          varsIgnorePattern: '_unused$',
        },
      ],
      'no-console': 'off',
      camelcase: [
        0,
        {
          properties: 'never',
        },
      ],
      'new-cap': [
        2,
        {
          newIsCapExceptions: [],
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'jsdoc/check-values': 'off',
      'jsdoc/lines-before-block': 'off',
    },
  },
  {
    files: ['**/*_test.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jasmine,
        ...globals.serviceworker,
      },
    },
  },
  {
    files: ['build/**/*.js'],
    rules: {
      '@typescript-eslint/camelcase': 'off',
    },
  },
];
