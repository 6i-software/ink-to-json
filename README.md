ink-tools
=========
> Compile inkle's story [Ink](https://github.com/inkle/ink) file into JSON, with watching mode. 

## Features
ink-utils is a CLI application built in node.js with [commander.js](https://github.com/tj/commander.js/).

It is designed in order to facilitate its integration wiht [inkjs](https://github.com/y-lohse/inkjs), the javascript implementation of inkle's ink scripting language, and to consume ink story into a web application (SPA, React, Angular ...)

- Compile a ink file into Json.
- Watch for ink file changes, in order to perform compilation each time. It depends on comparison of ink file MD5 checksums.

## Installation

Install with [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/).

Global installation:
```sh
$ yarn global add @6i/ink-tools
```

As local developpement dependencies:
```sh
$ yarn add @6i/ink-tools --dev
```

## Ink story

[Ink](http://www.inklestudios.com/ink) is [inkle](http://www.inklestudios.com)'s scripting language for writing interactive narrative, both for text-centric games as well as more graphical games that contain highly branching stories. It's designed to be easy to learn, but with powerful enough features to allow an advanced level of structuring.

## License
Release under [MIT](./LICENSE.md) license.

## Copyright
Copyright (c) 2020 by 2o1oo <vb20100bv@gmail.com>