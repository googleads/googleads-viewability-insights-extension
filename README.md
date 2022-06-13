# Ad Manager Viewability Insights 🚀

Ad Manager Viewability Insights is a open-source Dev Tools extension to help to improving the viewability and quality of fixed and dynamic ad slots of webpages.

![Example image of the extension](examples/viewability-insights.png)

This tool is a extension for the [Chrome DevTools](https://developer.chrome.com/docs/devtools/), an set of web developer tools built directly into the Google Chrome browser.

🧪 We are currently in beta and still in the development process. In order to help us improve please [file an issue](https://github.com/googleads/googleads-viewability-insights-extension/issues) to let us know of any issues or suggestions you may have.

⚠️ Ad Manager Viewability Insights results aren't an indication of compliance or non-compliance with any Google Publisher Policies.

## Chrome DevTools Extension

### 🛠️ Setup

From within the directory run:

```sh
npm install
npm run build
```

Load the 'dist' folder in your Chrome as locale extension folder.

### ⚗️ Usage

**Run it:** Open Chrome DevTools, select the **Viewability insights** panel and reload the page.

![Example image of the viewability insights panel](examples/viewability-insights-button.png)

#### Toolbar

The toolbar allows you to enable or disable the viewable overlays on the webpage.

![Example image of the toolbar](examples/tool-bar.png)

#### Viewability Insights Report

The report will provide you a detail overview about each single ad slot.

![Example image of the report](examples/report.png)

- **Slot Id**: The ID of the slot div provided when the slot was defined.
- **Ad Unit**: The full path of the ad unit, with the network code and ad unit path.
- **Size**: Indicates the pixel size of the rendered creative.
- **Line Item Id**: Line item ID of the rendered reservation or backfill ad.
- **Min Viewability**: Min. viewability before the slot became viewable.
- **Max Viewability**: Max. viewability of the slot.
- **Current Viewability**: The current on-screen percentage of an ad slot's area. The event is throttled and will not fire more often than once every 200ms.
- **Viewable**: Is the slot viewable, according to the [Active View criteria](https://support.google.com/admanager/answer/4524488).
- **Reloads**: Number of reloads of the slot.

#### Status Bar

The status bar will provide some general information about the ad slots.

![Example image of the status bar](examples/status-bar.png)

- **Ad Slots requested:** This event is fired when an ad has been requested for a particular slot.
- **Ad Slots rendered:** This event is fired when the creative code is injected into a slot and will occur before the creative's resources are fetched, so the creative may not be visible yet.
- **Ad Slots loaded:** This event is fired when the creative's iframe fires its load event. When rendering rich media ads in sync rendering mode, no iframe is used so no SlotOnloadEvent will be fired.
- **Ad Slots viewable:** This event is fired when an impression becomes viewable, according to the [Active View criteria](https://support.google.com/admanager/answer/4524488).
- **Ad Slots reloaded:** This event is fired when an already known slots gets destroyed or reloaded.
- **Ad Slots viewability:** This shows the percent of loaded ad slots to viewable ad slots.

## 📜 Licensing

Apache License, Version 2.0 see [LICENSE.md](LICENSE.md)

## 🐛 Report Issues

For any issues or feature requests, we would really appreciate it if you report
them using our [issue tracker](https://github.com/googleads/googleads-viewability-insights-extension/issues).

## 🤝 Contributing

Contributing to this project is subject to the guidelines in the
[CONTRIBUTING.md](CONTRIBUTING.md) file, which, in brief, requires that
contributors sign the [Individual Contributor License Agreement (CLA)][1].

[1]: https://cla.developers.google.com/
