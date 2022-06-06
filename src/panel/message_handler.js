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

import { ScriptHandler } from "./script_handler";

class MessageHandler {
  constructor() {
    this.port = null;
    this.report = null;
    this.sender = null;
    this.statusbar = null;
    this.tabId = null;
    this.token = Math.random().toString(36).substring(2);
    this.toolbar = null;
  }

  addEventListener() {
    chrome.runtime.onConnect.addListener(this.handleConnect.bind(this));
  }

  addToolbarReference(toolbar) {
    this.toolbar = toolbar;
  }

  addStatusbarReference(statusbar) {
    this.statusbar = statusbar;
  }

  addReportReference(report) {
    this.report = report;
  }

  handleConnect(port) {
    this.port = port;
    this.sender = port.sender;
    this.tabId = this.sender.tab.id;

    // Ignore events from other tabs.
    if (this.tabId != chrome.devtools.inspectedWindow.tabId) {
      return;
    }

    // Ignore events from other names.
    if (port.name != "viewability-insights") {
      return;
    }

    this.connected = false;

    // Add Message Listener
    port.onMessage.addListener(this.handleMessage.bind(this));

    // Inject and init Script
    ScriptHandler.injectScript(this.tabId, this.token);
  }

  handleMessage(message) {
    switch (message.type) {
      case "ads-slot-loaded":
        this.handleAdsSlotLoaded(message);
        break;
      case "ads-slots-loaded":
        this.handleAdsSlotsLoaded(message);
        break;
      case "ads-slot-viewable":
        this.handleAdsSlotViewable(message);
        break;
      case "ads-slots-viewable":
        this.handleAdsSlotsViewable(message);
        break;
      case "ads-slot-visibility":
        this.handleAdsSlotVisibility(message);
        break;
      case "init":
        this.handleInitMessage(message);
        break;
      case "status":
        this.handleStatusMessage(message);
        break;
      case "version":
        this.handleVersionMessage(message);
        break;
      default:
        console.warn("Received unhandled message:", message);
    }

    if (this.statusbar) {
      this.statusbar.setConnectStatus(this.connected);
    }
  }

  handleAdsSlotLoaded(message) {
    if (this.report) {
      this.report.addSlot(message.value);
    }
  }

  handleAdsSlotsLoaded(message) {
    if (this.statusbar) {
      this.statusbar.setAdsSlotsLoaded(message.value);
    }
  }

  handleAdsSlotViewable(message) {
    if (this.report) {
      this.report.updateSlot(message.value);
    }
  }

  handleAdsSlotsViewable(message) {
    if (this.statusbar) {
      this.statusbar.setAdsSlotsViewable(message.value);
    }
  }

  handleAdsSlotVisibility(message) {
    if (this.report) {
      this.report.updateSlot(message.value);
    }
  }

  handleInitMessage(message) {
    if (message.value == "knock knock") {
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

  handleStatusMessage(_message) {
    // Unused
  }

  handleVersionMessage(message) {
    if (this.statusbar) {
      this.statusbar.setGptVersion(message.value);
    }
  }

  postCommand(command, value) {
    if (this.port) {
      this.port.postMessage({ command: command, value: value });
    }
  }
}

export { MessageHandler };
