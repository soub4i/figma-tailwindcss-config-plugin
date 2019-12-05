# Figma + Tailwindcss = <3

This prpject is a small plugin for Figma to generate easily tailwindcss config file.

## Quickstart

- Run `yarn` to install dependencies.
- Run `yarn dev` to start webpack in watch mode.
- Open `Figma` -> `Plugins` -> `Development` -> `New Plugin...` and choose `manifest.json` file from this repo.

⭐ To change the UI of your plugin (the react code), start editing [ui.tsx](./src/ui.tsx).  
⭐ To interact with the Figma API edit [code.ts](./src/code.ts).  
⭐ Read more on the [Figma API Overview](https://www.figma.com/plugin-docs/api/api-overview/).

## Toolings

This project is using:

- React + Webpack
- TypeScript
- TSLint
