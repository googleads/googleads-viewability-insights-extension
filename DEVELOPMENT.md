# Development

In the case you want to build the **Ad Manager Viewability Insights** from source, you need to run the following [Node.js][node.js] commands within the directory to install the needed dependencies:

```sh
npm install
```

## Debugging Mode (Dev)

To get additional insights and logging message you need to use the following commands:

```sh
npm run build:dev
```

The compiled dev output will be in the **dist** folder.

## User Mode (Prod)

To get the user version you need to use the following commands:

```sh
npm run build
```

The compiled prod output will be in the **dist** folder.

[node.js]: https://nodejs.org/en/
