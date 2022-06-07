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

const CellContent = {
  Slot: 0,
  AdUnit: 1,
  LineItem: 2,
  MinViewability: 3,
  MaxViewability: 4,
  CurrentViewability: 5,
  Viewable: 6,
};

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
    const slotElementIdCell = row.insertCell(CellContent.Slot);
    slotElementIdCell.innerText = slot.slotElementId;
    const adUnitPathCell = row.insertCell(CellContent.AdUnit);
    adUnitPathCell.innerText = slot.adUnitPath;
    const lineItemIdCell = row.insertCell(CellContent.LineItem);
    lineItemIdCell.innerText = slot.lineItemId;
    const minViewabilityCell = row.insertCell(CellContent.MinViewability);
    minViewabilityCell.innerText = 0;
    const maxViewabilityCell = row.insertCell(CellContent.MaxViewability);
    maxViewabilityCell.innerText = 0;
    const currentViewabilityCell = row.insertCell(
      CellContent.CurrentViewability
    );
    currentViewabilityCell.innerText = 0;
    const viewableCell = row.insertCell(CellContent.Viewable);
    viewableCell.innerText = false;
  }

  updateSlot(slot) {
    if (!slot) {
      return;
    }
    const row = document.getElementById("row-" + slot.slotElementId);
    if (typeof slot.visibility != "undefined") {
      row.cells[CellContent.CurrentViewability].innerText = slot.visibility;
      if (slot.visibility > row.cells[CellContent.MaxViewability].innerText) {
        row.cells[CellContent.MaxViewability].innerText = slot.visibility;
      }
    }
    if (typeof slot.viewable != "undefined") {
      row.cells[CellContent.Viewable].innerText = slot.viewable;
      row.cells[CellContent.MinViewability].innerText =
        row.cells[CellContent.CurrentViewability].innerText;
    }
  }
}

export { Report };
