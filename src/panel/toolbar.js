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
 * @fileoverview Handles all toolbar related action and updates.
 */

import { ScriptHandler } from './script_handler';

/**
 * @class
 */
class Toolbar {
  /**
   * @constructor
   */
  constructor() {
    this.enabled = true;
    this.report = null;
  }

  /**
   * Add event listener for clickable elements like checkbox.
   */
  addEventListener() {
    document
      .querySelector('#button-reload')
      .addEventListener('click', this.reloadPage.bind(this));
    document
      .querySelector('#checkbox-show-viewable-overlay')
      .addEventListener('change', this.showViewableOverlay.bind(this));
    document
      .querySelector('#checkbox-show-active-view-elements')
      .addEventListener('change', this.showActiveViewElements.bind(this));
  }

  /**
   * Adds report reference for easier access.
   * @param {Report} report
   */
  addReportReference(report) {
    this.report = report;
  }

  /**
   * @param {event} event
   */
  reloadPage(event) {
    if (event && chrome.devtools.inspectedWindow.tabId) {
      console.debug(
        'Request to reload window tab',
        chrome.devtools.inspectedWindow.tabId,
      );
      if (this.report) {
        this.report.clear();
      }
      chrome.devtools.inspectedWindow.reload();
    } else {
      console.error('Unable to reload inspected window!');
    }
  }

  /**
   * @param {*} event
   */
  showViewableOverlay(event) {
    console.debug('Show Viewable Overlay', event.currentTarget.checked);
    ScriptHandler.enableViewableOverlay(event.currentTarget.checked);
  }

  /**
   * @param {*} event
   */
  showActiveViewElements(event) {
    console.debug('Show Active View Elements', event.currentTarget.checked);
  }

  /**
   * @static
   * @return {boolean}
   */
  static shouldShowViewableOverlay() {
    return document.querySelector('#checkbox-show-viewable-overlay').checked;
  }
}

export { Toolbar };
