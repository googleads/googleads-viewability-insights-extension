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

import { ScriptHandler } from './script_handler';

/**
 * Handles all messages for the communication between the:
 * - Panel Page
 * - Content Script
 * - Injected Script
 *
 * @class
 */
class MessageHandler {
  /**
   * @constructor
   */
  constructor() {
    this.port = null;
    this.report = null;
    this.sender = null;
    this.statusbar = null;
    this.tabId = null;
    this.token = Math.random().toString(36).substring(2);
    this.toolbar = null;
  }

  /**
   * Adds the message connect event listener to handle all messages.
   */
  addEventListener() {
    chrome.runtime.onConnect.addListener(this.handleConnect.bind(this));
  }

  /**
   * Adds toolbar reference for easier access.
   * @param {Toolbar} toolbar
   */
  addToolbarReference(toolbar) {
    this.toolbar = toolbar;
  }

  /**
   * Adds statusbar reference for easier access.
   * @param {Status} statusbar
   */
  addStatusbarReference(statusbar) {
    this.statusbar = statusbar;
  }

  /**
   * Adds report reference for easier access.
   * @param {Report} report
   */
  addReportReference(report) {
    this.report = report;
  }

  /**
   * @param {Port} port
   * @see https://developer.chrome.com/docs/extensions/reference/runtime/#event-onConnect
   */
  handleConnect(port) {
    this.port = port;
    this.sender = port.sender;
    this.tabId = this.sender.tab.id;

    // Ignore events from other tabs.
    if (this.tabId != chrome.devtools.inspectedWindow.tabId) {
      return;
    }

    // Ignore events from other names.
    if (port.name != 'viewability-insights') {
      return;
    }

    this.connected = false;

    // Add Message Listener
    port.onMessage.addListener(this.handleMessage.bind(this));

    // Inject and init Script
    ScriptHandler.injectScript(this.tabId, this.token);
  }

  /**
   * @param {function} message
   * @see https://developer.chrome.com/docs/extensions/reference/runtime/#event-onMessage
   */
  handleMessage(message) {
    switch (message.type) {
      case 'ads-slot-rendered':
        this.handleAdsSlotRendered(message);
        break;
      case 'ads-slot-loaded':
      case 'ads-slot-viewable':
      case 'ads-slot-visibility':
        this.handleReportUpdates(message);
        break;
      case 'ads-slots-loaded':
        this.handleAdsSlotsLoaded(message);
        break;
      case 'ads-slots-requested':
        this.handleAdsSlotsRequested(message);
        break;
      case 'ads-slots-rendered':
        this.handleAdsSlotsRendered(message);
        break;
      case 'ads-slots-reloaded':
        this.handleAdsSlotsReloaded(message);
        break;
      case 'ads-slots-viewable':
        this.handleAdsSlotsViewable(message);
        break;
      case 'init':
        this.handleInitMessage(message);
        break;
      case 'version':
        this.handleVersionMessage(message);
        break;
      default:
        console.warn('Received unhandled message:', message);
    }

    if (this.statusbar) {
      this.statusbar.setConnectStatus(this.connected);
    }
  }

  /**
   * @param {Object} message
   */
  handleAdsSlotRendered(message) {
    if (this.report && message.value) {
      this.report.addSlot(message.value);
    }
  }

  /**
   * @param {Object} message
   */
  handleAdsSlotsLoaded(message) {
    if (this.statusbar) {
      this.statusbar.setAdsSlotsLoaded(message.value);
    }
  }

  /**
   * @param {Object} message
   */
  handleAdsSlotsRequested(message) {
    if (this.statusbar) {
      this.statusbar.setAdsSlotsRequested(message.value);
    }
  }

  /**
   * @param {Object} message
   */
  handleAdsSlotsRendered(message) {
    if (this.statusbar) {
      this.statusbar.setAdsSlotsRendered(message.value);
    }
  }

  /**
   * @param {Object} message
   */
  handleAdsSlotsReloaded(message) {
    if (this.statusbar && message.value) {
      this.statusbar.setAdsSlotsReloaded(message.value);
    }
  }

  /**
   * @param {Object} message
   */
  handleAdsSlotsViewable(message) {
    if (this.statusbar) {
      this.statusbar.setAdsSlotsViewable(message.value);
    }
  }

  /**
   * @param {Object} message
   */
  handleReportUpdates(message) {
    if (this.report && message.value) {
      this.report.updateSlot(message.value);
    }
  }

  /**
   * @param {Object} message
   */
  handleInitMessage(message) {
    if (message.value && message.value == 'knock knock') {
      this.connected = true;
      this.port.postMessage({ token: this.token });
      if (this.report) {
        this.report.clear();
      }
      if (this.statusbar) {
        this.statusbar.clear();
      }
    }
  }

  /**
   * @param {Object} message
   */
  handleVersionMessage(message) {
    if (this.statusbar) {
      this.statusbar.setGptVersion(message.value);
    }
  }

  /**
   * @param {string} command
   * @param {Object} value
   */
  postCommand(command, value) {
    if (this.port) {
      this.port.postMessage({ command: command, value: value });
    }
  }
}

export { MessageHandler };
