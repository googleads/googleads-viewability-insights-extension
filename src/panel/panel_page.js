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
 * @file Defines the panel which includes the viewability report, statusbar and toolbar.
 */

import './../../assets/panel/panel_page.css';
import './../../node_modules/@material-design-icons/font/filled.css';
import './../../node_modules/@material-design-icons/font/outlined.css';

import { MessageHandler } from './message_handler';
import { Report } from './report';
import { Statusbar } from './statusbar';
import { Toolbar } from './toolbar';

const messageHandler = new MessageHandler();
const report = new Report();
const statusbar = new Statusbar();
const toolbar = new Toolbar();

messageHandler.addStatusbarReference(statusbar);
messageHandler.addReportReference(report);
messageHandler.addEventListener();
toolbar.addReportReference(report);

document.addEventListener('DOMContentLoaded', () => {
  toolbar.addEventListener();
  if (chrome.extension.inIncognitoContext) {
    document.querySelector('#incognito-note').style.display = 'inline-block';
  }
});
