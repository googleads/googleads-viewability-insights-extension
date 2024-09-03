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
 * @file Handles all statusbar related action and updates.
 */

/**
 * @class
 */
class Statusbar {
  /**
   * @class
   */
  constructor() {
    this.adsSlotsLoaded = 0;
    this.adsSlotsReloaded = 0;
    this.adsSlotsRendered = 0;
    this.adsSlotsRequested = 0;
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
    this.setAdsSlotsRequested();
    this.setAdsSlotsViewable();
    this.setConnectStatus();
    this.setGptVersion();
  }

  /**
   * @param {number} numAdsSlotsLoaded Number of ads slots loaded.
   */
  setAdsSlotsLoaded(numAdsSlotsLoaded) {
    this.adsSlotsLoaded = numAdsSlotsLoaded || 0;
    document.querySelector('#text-num-ads-slots-loaded').textContent =
      this.adsSlotsLoaded;
    this.updateAdsSlotsViewability();
  }

  /**
   * @param {number} numAdsSlotsRequested Number of ads slots requested.
   */
  setAdsSlotsRequested(numAdsSlotsRequested) {
    this.adsSlotsRequested = numAdsSlotsRequested || 0;
    document.querySelector('#text-num-ads-slots-requested').textContent =
      this.adsSlotsRequested;
  }

  /**
   * @param {number} numAdsSlotsRendered Number of ads slots rendered.
   */
  setAdsSlotsRendered(numAdsSlotsRendered) {
    this.adsSlotsRendered = numAdsSlotsRendered || 0;
    document.querySelector('#text-num-ads-slots-rendered').textContent =
      this.adsSlotsRendered;
    this.updateAdsSlotsViewability();
  }

  /**
   * @param {number} numAdsSlotsReload Number of ads slots reloaded.
   */
  setAdsSlotsReloaded(numAdsSlotsReload) {
    this.adsSlotsReloaded = numAdsSlotsReload || 0;
    document.querySelector('#text-num-ads-slots-reload').textContent =
      this.adsSlotsReloaded;
  }

  /**
   * @param {number} numAdsSlotsViewable Number of ads slots viewable.
   */
  setAdsSlotsViewable(numAdsSlotsViewable) {
    this.adsSlotsViewable = numAdsSlotsViewable || 0;
    document.querySelector('#text-num-ads-slots-visible').textContent =
      this.adsSlotsViewable;
    this.updateAdsSlotsViewability();
  }

  /**
   * @param {number} detectedGptVersion Detected GPT version.
   */
  setGptVersion(detectedGptVersion) {
    this.gptVersion = detectedGptVersion;
    document.querySelector('#text-gpt-version').textContent = this.gptVersion
      ? 'v' + this.gptVersion
      : '-';

    // Show starting-note, if we detect no gpt version.
    document.querySelector('#starting-note').style.display = this.gptVersion
      ? 'none'
      : 'block';
    document.querySelector('#report').style.display = !this.gptVersion
      ? 'none'
      : 'table';
  }

  /**
   * @param {boolean} isConnected Connection status.
   */
  setConnectStatus(isConnected) {
    this.connected = isConnected ? true : false;
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
