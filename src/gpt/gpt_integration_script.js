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

console.debug("Start Google Tag injection ...");

export default class ViewabilityInsights {
  constructor(token) {
    this.knownAdsSlots = {};
    this.showViewableOverlay = false;
    this.slotOnLoadCount = 0;
    this.slotRendererEndedCount = 0;
    this.token = token;
    this.viewableImpressionCount = 0;
  }

  addEventListener() {
    window.googletag = window.googletag || { cmd: [] };
    googletag.cmd.push(
      function () {
        googletag
          .pubads()
          .addEventListener(
            "impressionViewable",
            this.impressionViewable.bind(this)
          );
        googletag
          .pubads()
          .addEventListener(
            "slotVisibilityChanged",
            this.slotVisibilityChanged.bind(this)
          );
        googletag
          .pubads()
          .addEventListener(
            "slotRenderEnded",
            this.slotRendererEnded.bind(this)
          );
        googletag
          .pubads()
          .addEventListener("slotOnload", this.slotOnload.bind(this));
        window.postMessage({
          type: "version",
          token: this.token,
          value: googletag.getVersion(),
        });
      }.bind(this)
    );
  }

  slotVisibilityChanged(event) {
    window.postMessage({
      type: "ads-slot-visibility",
      token: this.token,
      value: {
        slotElementId: event.slot.getSlotElementId(),
        visibility: event.inViewPercentage,
      },
    });
    if (this.showViewableOverlay) {
      const slotElementId = event.slot.getSlotElementId();
      this.getOrCreateViewabilityOverlay(slotElementId);
    }
  }

  impressionViewable(event) {
    this.viewableImpressionCount++;
    if (this.showViewableOverlay) {
      const slotElementId = event.slot.getSlotElementId();
      const overlay = this.getOrCreateViewabilityOverlay(slotElementId);
      if (overlay) {
        overlay.classList.add("viewable");
      }
    }
    window.postMessage({
      type: "ads-slot-viewable",
      token: this.token,
      value: {
        slotElementId: event.slot.getSlotElementId(),
        viewable: true,
      },
    });
    window.postMessage({
      type: "ads-slots-viewable",
      token: this.token,
      value: this.viewableImpressionCount,
    });
  }

  slotRendererEnded(_event) {
    // Unused
  }

  slotOnload(event) {
    if (
      event.slot.getResponseInformation() == null ||
      event.slot.getSlotElementId() in this.knownAdsSlots
    ) {
      return;
    }
    this.slotOnLoadCount++;
    window.postMessage({
      type: "ads-slot-loaded",
      token: this.token,
      value: {
        adUnitPath: event.slot.getAdUnitPath(),
        slotElementId: event.slot.getSlotElementId(),
      },
    });
    window.postMessage({
      type: "ads-slots-loaded",
      token: this.token,
      value: this.slotOnLoadCount,
    });
    this.knownAdsSlots[event.slot.getSlotElementId()] = true;
  }

  getOrCreateViewabilityOverlay(elementId) {
    const slotElement = document.getElementById(elementId);
    if (!slotElement) {
      return;
    }

    const overlayElementId = "viewability-overlay-" + elementId;
    if (document.getElementById(overlayElementId)) {
      return document.getElementById(overlayElementId);
    }

    // Make sure to set a style.position attribute to avoid miss aligning with absolute elements.
    if (!slotElement.style.position) {
      slotElement.style.position = "relative";
    }

    const overlay = document.createElement("div");
    overlay.id = "viewability-overlay-" + elementId;
    overlay.className = "viewability-insights-overlay";
    slotElement.appendChild(overlay);
    return overlay;
  }

  enableViewableOverlay(enable) {
    this.showViewableOverlay = enable;
    if (!enable) {
      const elements = document.getElementsByClassName(
        "viewability-insights-overlay"
      );
      while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
      }
    }
  }
}
