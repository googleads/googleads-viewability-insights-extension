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

class ContentScript {
  constructor() {
    this.port = chrome.runtime.connect({ name: "viewability-insights" });
    this.token = null;
    this.connected = false;
  }

  init() {
    this.addEventListener();
    this.port.postMessage({ type: "init", value: "knock knock" });
    if (chrome.runtime.lastError) {
      // Ignore
    }
  }

  addEventListener() {
    this.port.onMessage.addListener(this.handleMessage.bind(this));
    this.port.onDisconnect.addListener(this.handleDisconnect.bind(this));
    window.addEventListener("message", this.handleWindowMessage.bind(this));
  }

  handleMessage(message) {
    if (message.token) {
      this.token = message.token;
      this.connected = true;
    }
  }

  handleDisconnect(_event) {
    this.connected = false;
  }

  handleWindowMessage(event) {
    if (
      event.source !== window ||
      typeof event.data.token == undefined ||
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

new ContentScript().init();
