# [UniDi Website and documentation](https://unidi.github.io/)

## Contents

- [Getting started](#getting-started)
- [Overview](#overview)
- [Website configuration](#website-configuration)
- [Contributing](#contributing)
- [License](#license)

## Getting started

### Prerequisites

1.  [Git](https://git-scm.com/downloads).
1.  [Node](https://nodejs.org/en/download/) _(version 12 or greater)_.
1.  [Yarn](https://yarnpkg.com/lang/en/docs/install/) _(version 1.5 or greater)_.
1.  A fork of the repo _(for any contributions)_.
1.  A clone of the `unidi.github.io` repo.

### Installation

1.  `cd unidi.github.io` to go into the project root.
1.  `yarn` to install the website's workspace dependencies.
1.  `cd website` to go into the website portion of the project.

### Running locally

1.  `yarn start` to start the development server _(powered by [Docusaurus](https://v2.docusaurus.io))_.
1.  `open http://localhost:3000/` to open the site in your favorite browser.

## Overview

All the content is generated from markdown files you can find in the `docs` directory.

**_To edit the internals of how the site is built,_** you may want to get familiarized with how the site is built. The UniDi website is a static site generated using [Docusaurus](https://v2.docusaurus.io). The website configuration can be found in the `website` directory. Visit the Docusaurus website to learn more about all the available configuration options.

### Directory Structure

The following is a high-level overview of relevant files and folders.

```
unidi.github.io
|-- docs
|   |-- 02-Get\ Started
|   |-- 03-Basic\ Principles
|   |-- 04-Advanced
|   |-- 05-Extensions
|   |-- 200-CheatSheet.md
|   |-- Docusaur-Docs
|   `-- intro.md
```

### Documentation sources

As mentioned above, the `docs` folder contains the source files for all of the docs in the website. In most cases, you will want to edit the files within this directory. If you're adding a new doc or you need to alter the order the docs appear in the sidebar, take a look at the `sidebars.json` file in the `website` directory. The sidebars file contains a list of document ids that should match those defined in the header metadata (aka frontmatter) of the docs markdown files.

## Website configuration

The main config file for the website can be found at `website/docusaurus.config.js`. This file tells [Docusaurus how to build the website](https://v2.docusaurus.io/docs/configuration). Edits to this file are rarely necessary.

The `core` subdirectory contains JavaScript and React components that are the core part of the website.

The `src/pages` subdirectory contains the React components that make up the non-documentation pages of the site, such as the homepage.

The `src/theme` subdirectory contains the swizzled React components from the Docusaurus theme.

## Contributing

### Create a branch

1.  `git checkout master` from any folder in your local `unidi.github.io` repository.
1.  `git pull origin master` to ensure you have the latest main code.
1.  `git checkout -b the-name-of-my-branch` to create a branch.
    > replace `the-name-of-my-branch` with a suitable name, such as `update-extensions-signals-doc`

### Make the change

1.  Follow the "[Running locally](#running-locally)" instructions.
1.  Save the files and check in the browser.
1.  Some changes may require a server restart to generate new files. (Pages in `docs` always do!)
1.  Edits to pages in `docs` will only be visible in the latest version of the documentation, called "Next", located under the `docs/next` path.

Visit **http://localhost:3000/docs/next/YOUR-DOCS-PAGE** to see your work.

> Visit http://localhost:3000/versions to see the list of all versions of the docs.

### Test the change

If possible, test any visual changes in all latest versions of the following browsers:

- Chrome and Firefox on the desktop.
- Chrome and Safari on mobile.

### Push it

1.  Run `yarn prettier` to ensure your changes are consistent with other files in the repo.
1.  `git add -A && git commit -m "My message"` to stage and commit your changes.
    > replace `My message` with a commit message, such as `Add screenshots to UniDi-Signals docs`
1.  `git push my-fork-name the-name-of-my-branch`
1.  Go to the [UniDi's website repo](https://github.com/UniDi/unidi.github.io) and you should see recently pushed branches.
1.  Follow GitHub's instructions.
1.  Describe briefly your changes (in case of visual changes, please include screenshots).

## License

UniDi is [Apache 2.0 licensed](./LICENSE.md).

React Native documentation is [Creative Commons licensed](./LICENSE-docs).
