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

class Toolbar {
  constructor() {
    this.enabled = false;
  }

  addEventListener() {
    document
      .querySelector("#button-enable-viewability-insights")
      .addEventListener("click", this.enableViewabilityInsights.bind(this));
    document
      .querySelector("#checkbox-show-viewable-overlay")
      .addEventListener("change", this.showViewableOverlay.bind(this));
    document
      .querySelector("#checkbox-show-active-view-elements")
      .addEventListener("change", this.showActiveViewElements.bind(this));
  }

  enableViewabilityInsights(event) {
    this.enabled = !this.enabled;
    event.currentTarget.classList.toggle("active");
    console.log(
      "Enable Viewability Insights",
      event.currentTarget,
      this.enabled
    );
    if (this.enabled) {
      chrome.devtools.inspectedWindow.reload();
    }
  }

  showViewableOverlay(event) {
    console.log("Show Viewable Overlay", event.currentTarget.checked);
    ScriptHandler.enableViewableOverlay(event.currentTarget.checked);
  }

  showActiveViewElements(event) {
    console.log("Show Active View Elements", event.currentTarget.checked);
  }

  static shouldShowViewableOverlay() {
    return document.querySelector("#checkbox-show-viewable-overlay").checked;
  }
}

export { Toolbar };
