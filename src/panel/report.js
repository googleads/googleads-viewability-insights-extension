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

class Report {
  constructor() {
    this.slots = {};
  }

  clear() {
    const reportTable = document.querySelector("#report > tbody");
    reportTable.parentNode.replaceChild(
      document.createElement("tbody"),
      reportTable
    );
  }

  addSlot(slot) {
    if (!slot) {
      return;
    }
    if (document.getElementById("row-" + slot.slotElementId)) {
      console.warn("Slot", slot.slotElementId, "already exists!");
      return;
    }
    this.slots[slot.slotElementId] = {
      adUnitPath: slot.adUnitPath,
      slotElementId: slot.slotElementId,
      viewable: false,
    };
    const reportTable = document.querySelector("#report > tbody");
    const row = reportTable.insertRow(-1);
    row.id = "row-" + slot.slotElementId;
    const slotElementIdCell = row.insertCell(0);
    slotElementIdCell.innerText = slot.slotElementId;
    const adUnitPathCell = row.insertCell(1);
    adUnitPathCell.innerText = slot.adUnitPath;
    const minViewabilityCell = row.insertCell(2);
    minViewabilityCell.innerText = 0;
    const maxViewabilityCell = row.insertCell(3);
    maxViewabilityCell.innerText = 0;
    const currentViewabilityCell = row.insertCell(4);
    currentViewabilityCell.innerText = 0;
    const viewableCell = row.insertCell(5);
    viewableCell.innerText = false;
  }

  updateSlot(slot) {
    if (!slot) {
      return;
    }
    const row = document.getElementById("row-" + slot.slotElementId);
    if (typeof slot.visibility != "undefined") {
      row.cells[4].innerText = slot.visibility;
      if (slot.visibility > row.cells[3].innerText) {
        row.cells[3].innerText = slot.visibility;
      }
    }
    if (typeof slot.viewable != "undefined") {
      row.cells[5].innerText = slot.viewable;
      row.cells[2].innerText = row.cells[3].innerText;
    }
  }
}

export { Report };
