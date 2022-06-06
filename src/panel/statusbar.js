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

class Statusbar {
  constructor() {
    this.adsSlotsLoaded = 0;
    this.adsSlotsViewability = 0;
    this.adsSlotsViewable = 0;
    this.connected = false;
    this.gptVersion = 0;
    this.messageHandler = null;
  }

  clear() {
    this.setAdsSlotsLoaded();
    this.setAdsSlotsViewable();
    this.setGptVersion();
  }

  setAdsSlotsLoaded(value) {
    this.adsSlotsLoaded = value || 0;
    document.querySelector("#text-num-ads-slots-loaded").textContent =
      this.adsSlotsLoaded;
    this.updateAdsSlotsViewability();
  }

  setAdsSlotsViewable(value) {
    this.adsSlotsViewable = value || 0;
    document.querySelector("#text-num-ads-slots-visible").textContent =
      this.adsSlotsViewable;
    this.updateAdsSlotsViewability();
  }

  setGptVersion(value) {
    this.gptVersion = value;
    document.querySelector("#text-gpt-version").textContent = this.gptVersion
      ? "v" + this.gptVersion
      : "-";
  }

  setConnectStatus(value) {
    this.connected = value;
    document
      .querySelector("#icon-connect-status")
      .classList.toggle("connected", this.connected);
  }

  updateAdsSlotsViewability() {
    this.adsSlotsViewability =
      this.adsSlotsLoaded > 0
        ? (100 / this.adsSlotsLoaded) * this.adsSlotsViewable
        : 0;
    document.querySelector("#text-num-ads-slots-viewability").textContent =
      parseFloat(this.adsSlotsViewability).toFixed(2) + "%";
  }
}

export { Statusbar };
