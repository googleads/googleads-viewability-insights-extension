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
 * Main class to handle all statusbar related action and updates.
 * @class
 */
class Statusbar {
  /**
   * @constructor
   */
  constructor() {
    this.adsSlotsLoaded = 0;
    this.adsSlotsReloaded = 0;
    this.adsSlotsRendered = 0;
    this.adsSlotsViewability = 0;
    this.adsSlotsViewable = 0;
    this.connected = false;
    this.gptVersion = 0;
    this.messageHandler = null;
  }

  /**
   * Clears the status bar.
   */
  clear() {
    this.setAdsSlotsLoaded();
    this.setAdsSlotsReloaded();
    this.setAdsSlotsRendered();
    this.setAdsSlotsViewable();
    this.setGptVersion();
  }

  /**
   * @param {number} value
   */
  setAdsSlotsLoaded(value) {
    this.adsSlotsLoaded = value || 0;
    document.querySelector('#text-num-ads-slots-loaded').textContent =
      this.adsSlotsLoaded;
    this.updateAdsSlotsViewability();
  }

  /**
   * @param {number} value
   */
  setAdsSlotsRendered(value) {
    this.adsSlotsRendered = value || 0;
    document.querySelector('#text-num-ads-slots-rendered').textContent =
      this.adsSlotsRendered;
    this.updateAdsSlotsViewability();
  }

  /**
   * @param {number} value
   */
  setAdsSlotsReloaded(value) {
    this.adsSlotsReloaded = value || 0;
    document.querySelector('#text-num-ads-slots-reload').textContent =
      this.adsSlotsReloaded;
  }

  /**
   * @param {number} value
   */
  setAdsSlotsViewable(value) {
    this.adsSlotsViewable = value || 0;
    document.querySelector('#text-num-ads-slots-visible').textContent =
      this.adsSlotsViewable;
    this.updateAdsSlotsViewability();
  }

  /**
   * @param {number} value
   */
  setGptVersion(value) {
    this.gptVersion = value;
    document.querySelector('#text-gpt-version').textContent = this.gptVersion
      ? 'v' + this.gptVersion
      : '-';
  }

  /**
   * @param {boolean} value
   */
  setConnectStatus(value) {
    this.connected = value;
    document
      .querySelector('#icon-connect-status')
      .classList.toggle('connected', this.connected);
  }

  /**
   * Update ads slot viewability according the current state.
   */
  updateAdsSlotsViewability() {
    this.adsSlotsViewability =
      this.adsSlotsLoaded > 0
        ? (100 / this.adsSlotsLoaded) * this.adsSlotsViewable
        : 0;
    document.querySelector('#text-num-ads-slots-viewability').textContent =
      parseFloat(this.adsSlotsViewability).toFixed(2) + '%';
  }
}

export { Statusbar };
