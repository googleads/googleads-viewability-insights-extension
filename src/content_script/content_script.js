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
 * @fileoverview Handles the communication between the injected scripts <-> panel page.
 */

/**
 * @class
 */
class ContentScript {
  /**
   * @constructor
   */
  constructor() {
    this.connectionName = 'viewability-insights';
    this.token = null;
    this.connected = false;
    this.port = chrome.runtime.connect({ name: this.connectionName });
  }

  /**
   * Init event listener if there is no error and there is an valid port.
   */
  init() {
    if (chrome.runtime.lastError) {
      console.warn(
        'Unable to init script, got error:',
        chrome.runtime.lastError,
      );
    } else if (this.port) {
      this.addEventListener();
      this.port.postMessage({ type: 'init', value: 'knock knock' });
    } else {
      console.error(
        'Unable to find a valid connection for',
        this.connectionName,
      );
    }
  }

  /**
   * Ads the message event listener to the port and window.
   */
  addEventListener() {
    if (this.port) {
      console.debug(
        'Adding message handler for',
        this.connectionName,
        'with port',
        this.port,
      );
      this.port.onDisconnect.addListener(this.handlePortDisconnect.bind(this));
      this.port.onMessage.addListener(this.handlePortMessage.bind(this));
      window.addEventListener('message', this.handleWindowMessage.bind(this));
    }
  }

  /**
   * @param {*} message
   */
  handlePortMessage(message) {
    if (message && message.token) {
      this.token = message.token;
      if (!this.connected) {
        this.handlePortConnect();
      }
    }
  }

  /**
   * Handles Connects of the port.
   */
  handlePortConnect() {
    console.debug('Connection', this.connectionName, 'is connected.');
    if (chrome.runtime.lastError) {
      console.error(
        'Connection',
        this.connectionName,
        'error:',
        chrome.runtime.lastError.message,
      );
    }
    this.connected = true;
  }

  /**
   * Handles disconnects of the port.
   */
  handlePortDisconnect() {
    if (chrome.runtime.lastError && this.connected) {
      console.error(
        'Connection',
        this.connectionName,
        'is disconnected, because of error:',
        chrome.runtime.lastError.message,
      );
      this.connected = false;
    } else if (this.connected) {
      console.debug('Connection', this.connectionName, 'is disconnected!');
      this.connected = false;
    }
  }

  /**
   * @param {MessageEvent} event
   */
  handleWindowMessage(event) {
    // Ignore all window message without any or valid token.
    if (
      event.source !== window ||
      !event.data ||
      typeof event.data.token == 'undefined' ||
      !this.token ||
      event.data.token != this.token
    ) {
      return;
    }

    if (
      this.connected &&
      this.port &&
      event.data &&
      event.data.type &&
      event.data.value
    ) {
      this.port.postMessage({ type: event.data.type, value: event.data.value });
    }
  }
}

// Init content script automatically after injection.
new ContentScript().init();
