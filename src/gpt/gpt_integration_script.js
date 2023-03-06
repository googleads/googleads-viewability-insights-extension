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
 * Handles all GPT related integration points.
 * @class
 */
export default class ViewabilityInsights {
  /**
   * @param {string} token
   * @constructor
   */
  constructor(token) {
    this.knownAdsSlots = {};
    this.showViewableOverlay = false;
    this.slotOnLoadCount = 0;
    this.slotReloadedCount = 0;
    this.slotRendererEndedCount = 0;
    this.slotRequestedCount = 0;
    this.token = token;
    this.viewableImpressionCount = 0;
  }

  /**
   * Ads the googletag event listener as soon googletag is ready.
   */
  addEventListener() {
    window.googletag = window.googletag || { cmd: [] };
    googletag.cmd.push(
      function () {
        // Send the version string first, so that we know we are connected.
        window.postMessage({
          type: 'version',
          token: this.token,
          value: googletag.getVersion(),
        });

        // All event listener are added with an try and catch to avoid possible edge cases.
        try {
          googletag
            .pubads()
            .addEventListener(
              'impressionViewable',
              this.impressionViewable.bind(this)
            );
        } catch (e) {
          console.debug('Unable to add listener for impressionViewable:', e);
        }
        try {
          googletag
            .pubads()
            .addEventListener('slotRequested', this.slotRequested.bind(this));
        } catch (e) {
          console.debug('Unable to add listener for slotRequested:', e);
        }
        try {
          googletag
            .pubads()
            .addEventListener(
              'slotVisibilityChanged',
              this.slotVisibilityChanged.bind(this)
            );
        } catch (e) {
          console.debug('Unable to add listener for slotVisibilityChanged:', e);
        }
        try {
          googletag
            .pubads()
            .addEventListener(
              'slotRenderEnded',
              this.slotRendererEnded.bind(this)
            );
        } catch (e) {
          console.debug('Unable to add listener for slotRenderEnded:', e);
        }
        try {
          googletag
            .pubads()
            .addEventListener('slotOnload', this.slotOnload.bind(this));
        } catch (e) {
          console.debug('Unable to add listener for slotOnload:', e);
        }
      }.bind(this)
    );
  }

  /**
   * @param {googletag.events.ImpressionViewableEvent} event
   */
  impressionViewable(event) {
    this.viewableImpressionCount++;
    const slotElementId = event.slot.getSlotElementId();
    if (this.showViewableOverlay) {
      const overlay = this.getOrCreateViewabilityOverlay(slotElementId);
      if (overlay) {
        overlay.classList.add('viewable');
      }
    }
    window.postMessage({
      type: 'ads-slot-viewable',
      token: this.token,
      value: {
        slotElementId: slotElementId,
        viewable: true,
      },
    });
    window.postMessage({
      type: 'ads-slots-viewable',
      token: this.token,
      value: this.viewableImpressionCount,
    });
  }

  /**
   * @param {googletag.events.SlotRequestedEvent} event
   */
  slotRequested() {
    this.slotRequestedCount++;
    window.postMessage({
      type: 'ads-slots-requested',
      token: this.token,
      value: this.slotRequestedCount,
    });
  }

  /**
   * @param {googletag.events.SlotVisibilityChangedEvent} event
   */
  slotVisibilityChanged(event) {
    const slotElementId = event.slot.getSlotElementId();
    window.postMessage({
      type: 'ads-slot-visibility',
      token: this.token,
      value: {
        slotElementId: slotElementId,
        visibility: event.inViewPercentage,
      },
    });
    if (this.showViewableOverlay) {
      this.getOrCreateViewabilityOverlay(slotElementId);
    }
  }

  /**
   * @param {googletag.events.SlotRenderEndedEvent} event
   */
  slotRendererEnded(event) {
    if (event.isEmpty) {
      return;
    }
    const slotElementId = event.slot.getSlotElementId();
    const sourceAgnosticLineItemId = event.sourceAgnosticLineItemId;
    const size = event.size;
    this.slotRendererEndedCount++;
    window.postMessage({
      type: 'ads-slot-rendered',
      token: this.token,
      value: {
        adUnitPath: event.slot.getAdUnitPath(),
        lineItemId: sourceAgnosticLineItemId,
        size: size,
        slotElementId: slotElementId,
      },
    });
    window.postMessage({
      type: 'ads-slots-rendered',
      token: this.token,
      value: this.slotRendererEndedCount,
    });

    // Calculate slots reloads and adjust overlay, if needed.
    if (slotElementId in this.knownAdsSlots) {
      this.slotReloadedCount++;
      window.postMessage({
        type: 'ads-slots-reloaded',
        token: this.token,
        value: this.slotReloadedCount,
      });
      this.updateViewbilityOverlayById(slotElementId);
    } else {
      this.knownAdsSlots[slotElementId] = true;
    }

    // Ad viewable overlay for visual confirmation.
    if (this.showViewableOverlay) {
      this.getOrCreateViewabilityOverlay(slotElementId, size);
    }
  }

  /**
   * @param {googletag.events.SlotOnloadEvent} event
   */
  slotOnload(event) {
    const responseInformation = event.slot.getResponseInformation();
    const slotElementId = event.slot.getSlotElementId();
    if (responseInformation == null) {
      return;
    }
    this.slotOnLoadCount++;
    window.postMessage({
      type: 'ads-slot-loaded',
      token: this.token,
      value: {
        adUnitPath: event.slot.getAdUnitPath(),
        slotElementId: slotElementId,
        lineItemId: responseInformation.lineItemId,
      },
    });
    window.postMessage({
      type: 'ads-slots-loaded',
      token: this.token,
      value: this.slotOnLoadCount,
    });
  }

  /**
   * @param {HTMLElement} parentElement GPT Tag Element
   * @return {HTMLElement}
   */
  getGoogleAdsIframeContainer(parentElement) {
    // Early return if we already have the container.
    if (
      parentElement.tagName == 'DIV' &&
      parentElement.id &&
      parentElement.id.startsWith('google_ads_iframe_') &&
      parentElement.id.endsWith('__container__')
    ) {
      return parentElement;
    }

    // Find the container in the direct children.
    if (parentElement && parentElement.childElementCount > 0) {
      for (const childElement of parentElement.children) {
        if (
          childElement.tagName == 'DIV' &&
          childElement.id &&
          childElement.id.startsWith('google_ads_iframe_') &&
          childElement.id.endsWith('__container__')
        ) {
          return childElement;
        }
      }
    }
    return null;
  }

  /**
   * @param {HTMLElement} parentElement Google Ads IFrame Container
   * @return {HTMLElement}
   */
  getGoogleAdsIframe(parentElement) {
    // Early return if we already have the container.
    if (
      parentElement.tagName == 'IFRAME' &&
      parentElement.id &&
      parentElement.id.startsWith('google_ads_iframe_') &&
      !parentElement.id.endsWith('__container__')
    ) {
      return parentElement;
    }

    // Find the container in the direct children.
    if (parentElement && parentElement.childElementCount > 0) {
      for (const childElement of parentElement.children) {
        if (
          childElement.tagName == 'IFRAME' &&
          childElement.id &&
          childElement.id.startsWith('google_ads_iframe_') &&
          !childElement.id.endsWith('__container__')
        ) {
          return childElement;
        }
      }
    }
    return null;
  }

  /**
   * @param {string} elementId
   * @param {null|string|number[]} size
   */
  updateViewbilityOverlayById(elementId, size) {
    this.updateViewbilityOverlay(
      document.getElementById('viewability-overlay-' + elementId),
      size
    );
  }

  /**
   * @param {HTMLElement} overlayElement
   * @param {null|string|number[]} size
   */
  updateViewbilityOverlay(overlayElement, size) {
    if (!overlayElement || !overlayElement.parentElement) {
      return;
    }
    const parentElement = overlayElement.parentElement;

    // Try to get the correct width and height of the ad slot to display the overlay.
    let width = 1;
    let height = 1;

    // Check if we could use the active view viewability container.
    const activeViewContainers = parentElement.getElementsByClassName(
      'GoogleActiveViewInnerContainer'
    );
    if (activeViewContainers.length == 1) {
      const activeViewContainer = activeViewContainers[0];
      width = activeViewContainer.clientWidth;
      height = activeViewContainer.clientHeight;
    }

    // If we could not get the width and height from the active view container we will try to get it over the Iframe container instead.
    const googleAdsIframeContainer =
      this.getGoogleAdsIframeContainer(parentElement);
    if (googleAdsIframeContainer && (width <= 1 || height <= 1)) {
      const googleAdsIframe = this.getGoogleAdsIframe(googleAdsIframeContainer);
      if (googleAdsIframe) {
        width = googleAdsIframe.clientWidth;
        height = googleAdsIframe.clientHeight;
      }
    }

    // As last resort we will try to get the width and height from the slot size.
    if (size) {
      if (
        Object.prototype.toString.call(size) === '[object String]' &&
        size.includes(',') &&
        size != '0,0'
      ) {
        const slotSizes = size.split(',');
        if (slotSizes[0] > 0 && slotSizes[1] > 0) {
          width = slotSizes[0];
          height = slotSizes[1];
        }
      } else if (
        Array.isArray(size) &&
        size.length == 2 &&
        Number.isInteger(size[0]) &&
        Number.isInteger(size[1])
      ) {
        if (size[0] > 1) {
          width = size[0];
        }
        if (size[1] > 1) {
          height = size[1];
        }
      }
    }

    // If we a width and height greater than 1 we will adjust the overlay width and height.
    if (width > 1) {
      overlayElement.style.width = width + 'px';
    }
    if (height > 1) {
      overlayElement.style.height = height + 'px';
    }
  }

  /**
   * @param {string} elementId
   * @param {null|string|number[]} size
   * @return {HTMLElement}
   */
  getOrCreateViewabilityOverlay(elementId, size) {
    const slotElement = document.getElementById(elementId);
    if (!slotElement) {
      return;
    }

    // Early return if overlay already exists.
    const overlayElementId = 'viewability-overlay-' + elementId;
    if (document.getElementById(overlayElementId)) {
      this.updateViewbilityOverlayById(elementId, size);
      return document.getElementById(overlayElementId);
    }

    // Get relevant parent Element to inject the overlay
    const googleAdsIframeContainer =
      this.getGoogleAdsIframeContainer(slotElement);
    const parentElement = googleAdsIframeContainer
      ? googleAdsIframeContainer
      : slotElement;

    // Make sure to set a style.position attribute to avoid miss aligning with absolute elements.
    if (!parentElement.style.position) {
      parentElement.style.position = 'relative';
    }

    // Construct element.
    const overlay = document.createElement('div');
    overlay.id = 'viewability-overlay-' + elementId;
    overlay.className = 'viewability-insights-overlay';

    // Handle padding of parent element, if needed.
    if (
      !googleAdsIframeContainer &&
      window.getComputedStyle(parentElement) &&
      window.getComputedStyle(parentElement).paddingTop &&
      window.getComputedStyle(parentElement).paddingTop != '0px'
    ) {
      overlay.style.top = window.getComputedStyle(parentElement).paddingTop;
    }

    // Add Slot Info container
    const slotInfo = document.createElement('span');
    slotInfo.className = 'slot-info';
    slotInfo.innerText = elementId;
    overlay.appendChild(slotInfo);

    // Add Viewability Info container
    parentElement.appendChild(overlay);

    // Update overlay size.
    this.updateViewbilityOverlay(overlay, size);

    return overlay;
  }

  /**
   * @param {boolean} enable
   */
  enableViewableOverlay(enable) {
    this.showViewableOverlay = enable;
    if (!enable) {
      const elements = document.getElementsByClassName(
        'viewability-insights-overlay'
      );
      while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
      }
    }
  }
}
