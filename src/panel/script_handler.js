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
 *
 * @fileoverview Handles all script injections into the webpage and the gpt library.
 */

import { Toolbar } from './toolbar';

/**
 * @class
 */
class ScriptHandler {
  /**
   * @param {string} tabId
   * @param {string} sessionToken
   * @static
   */
  static injectScript(tabId, sessionToken) {
    chrome.scripting.executeScript(
      {
        files: ['gpt_integration_script.js'],
        target: { tabId: tabId },
        world: 'MAIN',
      },
      (injectionResults) => {
        console.log('Inject Script results:', injectionResults);
        ScriptHandler.injectStyleSheet(tabId);
        ScriptHandler.initScript(tabId, sessionToken);
      },
    );
  }

  /**
   * @param {string} tabId
   * @static
   */
  static injectStyleSheet(tabId) {
    chrome.scripting.insertCSS(
      {
        files: ['gpt_integration_script.css'],
        target: { tabId: tabId },
      },
      (injectionResults) => {
        console.log('Inject StyleSheet results:', injectionResults);
      },
    );
  }

  /**
   * @param {string} tabId
   * @param {string} sessionToken
   * @static
   */
  static initScript(tabId, sessionToken) {
    chrome.scripting.executeScript(
      {
        function: function (token) {
          window.viewabilityInsightsTools = new ViewabilityInsights(token);
          window.viewabilityInsightsTools.addEventListener();
        },
        target: { tabId: tabId },
        args: [sessionToken],
        world: 'MAIN',
      },
      (injectionResults) => {
        console.log('Init Script results:', injectionResults);
        ScriptHandler.enableViewableOverlay(
          Toolbar.shouldShowViewableOverlay(),
        );
      },
    );
  }

  /**
   * @param {boolean} enable
   * @static
   */
  static enableViewableOverlay(enable) {
    chrome.scripting.executeScript(
      {
        function: function (showViewableOverlay) {
          window.viewabilityInsightsTools.enableViewableOverlay(
            showViewableOverlay,
          );
        },
        target: { tabId: chrome.devtools.inspectedWindow.tabId },
        args: [enable],
        world: 'MAIN',
      },
      (injectionResults) => {
        console.log('enableViewableOverlay:', injectionResults);
      },
    );
  }

  /**
   * @param {string} elementId
   * @static
   */
  static scrollIntoView(elementId) {
    chrome.scripting.executeScript(
      {
        function: function (elementId) {
          if (elementId && document.getElementById(elementId)) {
            document.getElementById(elementId).scrollIntoView(false);
          }
        },
        target: { tabId: chrome.devtools.inspectedWindow.tabId },
        args: [elementId],
        world: 'MAIN',
      },
      (injectionResults) => {
        console.log('scrollIntoView:', injectionResults);
      },
    );
  }
}

export { ScriptHandler };
