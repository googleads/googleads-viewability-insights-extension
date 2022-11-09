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

import { ScriptHandler } from './script_handler';

const CellContent = {
  Index: 0,
  Slot: 1,
  AdUnit: 2,
  Size: 3,
  LineItem: 4,
  MinViewability: 5,
  MaxViewability: 6,
  CurrentViewability: 7,
  Viewable: 8,
  Reloads: 9,
};

const CellName = {
  Index: 'index',
  Slot: 'slot-id',
  AdUnit: 'ad-unit',
  Size: 'ad-size',
  LineItem: 'line-item',
  MinViewability: 'min-viewability',
  MaxViewability: 'max-viewability',
  CurrentViewability: 'current-viewability',
  Viewable: 'viewable',
  Reloads: 'reloads',
};

/**
 * Handles all report relevant display of data and graphs.
 * @class
 */
class Report {
  /**
   * @constructor
   */
  constructor() {
    this.slotCounter = 0;
  }

  /**
   * Clears the report table.
   */
  clear() {
    const reportTable = document.querySelector('#report > tbody');
    reportTable.parentNode.replaceChild(
      document.createElement('tbody'),
      reportTable
    );
    this.slotCounter = 0;
  }

  /**
   * @param {*} slot
   * @return {HTMLElement}
   */
  addSlot(slot) {
    if (!slot) {
      return;
    }
    if (document.getElementById('row-' + slot.slotElementId)) {
      const existingRow = document.getElementById('row-' + slot.slotElementId);

      // Reset values
      existingRow.classList.remove('viewable');
      existingRow.cells[CellContent.AdUnit].innerText = slot.adUnitPath;
      existingRow.cells[CellContent.CurrentViewability].innerText = 0;
      existingRow.cells[CellContent.LineItem].innerText = slot.lineItemId;
      existingRow.cells[CellContent.MaxViewability].innerText = 0;
      existingRow.cells[CellContent.MinViewability].innerText = 0;
      existingRow.cells[CellContent.Viewable].innerText = false;

      // Increase reload count after each reload.
      existingRow.cells[CellContent.Reloads].innerText =
        Number(existingRow.cells[CellContent.Reloads].innerText) + 1;

      return existingRow;
    }
    const reportTable = document.querySelector('#report > tbody');
    const row = reportTable.insertRow(this.slotCounter);
    row.id = 'row-' + slot.slotElementId;

    // Added default cells, event handler and values.
    this.insertCell_(
      row,
      CellContent.Index,
      CellName.Index,
      this.slotCounter + 1
    );
    this.insertCell_(
      row,
      CellContent.Slot,
      CellName.Slot,
      slot.slotElementId,
      this.scrollIntoView
    );
    this.insertCell_(row, CellContent.AdUnit, CellName.AdUnit, slot.adUnitPath);
    this.insertCell_(row, CellContent.Size, CellName.Size, slot.size);
    this.insertCell_(
      row,
      CellContent.LineItem,
      CellName.LineItem,
      slot.lineItemId || ''
    );
    this.insertCell_(
      row,
      CellContent.MinViewability,
      CellName.MinViewability,
      0
    );
    this.insertCell_(
      row,
      CellContent.MaxViewability,
      CellName.MaxViewability,
      0
    );
    this.insertCell_(
      row,
      CellContent.CurrentViewability,
      CellName.CurrentViewability,
      0
    );
    this.insertCell_(row, CellContent.Viewable, CellName.Viewable, false);
    this.insertCell_(row, CellContent.Reloads, CellName.Reloads, 0);

    // Increase Slot counter.
    this.slotCounter++;
    return row;
  }

  /**
   * @param {*} slot
   */
  updateSlot(slot) {
    if (!slot) {
      return;
    }
    const row =
      document.getElementById('row-' + slot.slotElementId) ||
      this.addSlot(slot);
    if (!row) {
      console.error(
        'Unable to create / get reporting row for',
        slot.slotElementId
      );
      return;
    }

    // Update line item ID, if needed.
    if (
      typeof slot.lineItemId != 'undefined' &&
      slot.lineItemId &&
      row.cells[CellContent.LineItem].innerText === ''
    ) {
      row.cells[CellContent.LineItem].innerText = slot.lineItemId;
    }

    // Update ad unit, if needed.
    if (typeof slot.adUnitPath != 'undefined') {
      row.cells[CellContent.AdUnit].innerText = slot.adUnitPath;
    }

    // Update slot size, if needed.
    if (typeof slot.size != 'undefined') {
      row.cells[CellContent.Size].innerText = slot.size;
    }

    // Update visibility, if needed.
    if (typeof slot.visibility != 'undefined') {
      row.cells[CellContent.CurrentViewability].innerText = slot.visibility;
      if (slot.visibility > row.cells[CellContent.MaxViewability].innerText) {
        row.cells[CellContent.MaxViewability].innerText = slot.visibility;
      }
    }

    // Update viewable, if needed.
    if (typeof slot.viewable != 'undefined') {
      if (slot.viewable) {
        row.classList.add('viewable');
      } else {
        row.classList.remove('viewable');
      }
      row.cells[CellContent.Viewable].innerText = slot.viewable;
      row.cells[CellContent.MinViewability].innerText =
        row.cells[CellContent.CurrentViewability].innerText;
    }
  }

  /**
   * @param {Event} event
   */
  scrollIntoView(event) {
    if (event.target && event.target.innerText) {
      ScriptHandler.scrollIntoView(event.target.innerText);
    }
  }

  /**
   * @param {HTMLElement} row
   * @param {number} index
   * @param {string} name
   * @param {*} value
   * @param {function?} clickHandler
   * @private
   */
  insertCell_(row, index, name, value, clickHandler = null) {
    const cell = row.insertCell(index);
    cell.classList.add(name);
    cell.innerText = typeof value != 'undefined' ? value : '';

    if (cell && clickHandler && typeof clickHandler === 'function') {
      row.addEventListener('click', clickHandler);
    }
  }
}

export { Report };
