# Zettel Terminal Extension Seed

This repository contains a seed project to speed-up developing extensions for [Zettel Terminal](https://app.zettel.ooo). You can read more about the product [here](http://zettel.ooo).

The repository insists of two projects:

1. The `client` project, this is the main extension implementation which is about to be executed along with the actual web-based app itself.

   Here are the scripts to support that:

   - To upgrade the Zettel official dependencies to their newest versions in order to access the latest API end-points:
     ```sh
     client$ npm run upgrade
     ```
   - To upgrade the extension version in `public/manifest.jsonc` file:
     ```sh
     client$ npm run version -- patch
     client$ npm run version -- minor
     client$ npm run version -- major
     ```
   - To build the extension and pack the zip file to be uploaded to [Zettel Developer Console](https://app.zettel.ooo/developer):
     ```sh
     client$ npm run build
     ```
     > **Note:** The built extension goes to the `client/output` folder.

1. The `server` project, which is only needed for extensions which require their own server-side implementation.

   Here are the scripts to support that:

   - To upgrade the Zettel official dependencies to their newest versions in order to access the latest API end-points:
     ```sh
     server$ npm run upgrade
     ```
   - To start the server:
     ```sh
     server$ npm run dev   # For development, with hot reloads
     server$ npm start     # For production
     ```

Both projects are filled with some dummy implementations to show-case how to setup things, feel free to modify this as you like, or even start your own projects and follow the approaches in this seed project.

### Example

This [video](https://youtu.be/0lCX7MElezY) demonstrates how you can start your own extension based on this seed project and what are the flows that you as a developer will follow to test and publish your extension.

The resulted sample project of that demonstration video is available under [this link](https://github.com/zettelyay/zettel-terminal-extension-example).

For more information, please [contact the development](mailto:ahs502@gmail.com) team.
