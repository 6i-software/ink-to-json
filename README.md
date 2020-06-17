ink-tools
=========
> Compile inkle's story [Ink](https://github.com/inkle/ink) file into JSON, with watching mode. 

![ink-tools CLI application](./doc/ink-tools.png)

## Features
ink-utils is a CLI application built in node.js with [commander.js](https://github.com/tj/commander.js/). It was designed in order to facilitate its integration wiht [inkjs](https://github.com/y-lohse/inkjs), the javascript implementation of inkle's ink scripting language, and to consume ink story into a web application (SPA, React, Angular ...)

ink-utils can :

- Compile a ink file into Json.
- Watch for ink file changes, in order to perform compilation each time.

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

## Usages

### Options

The `compile` command have many options :

| options          | description |
|------------------|-------------|
| `-s, --silent`   | Do not output any message
| `-vǀ-vvǀ-vvv, --verbose` | Increase the verbosity level : level 1 for normal information, 2 more verbose for debugging and 3 for full debug.
| `-o, --output`   | Change the output where JSON file is created.
| `-w, --watch`    | Enable watch mode, to detect if ink file has changed and start compilation each time.

### Make a single compilation

The `compile` command wait as first argument an *.ink file. Without another option, it will compil into a json file with the same name and the same folder of input ink file.

```sh
# Simple usage
$ ink-tools compile .\ink\story-basic.ink

=== Start compilation ===
[success] Inklecate compilation has finished !
```

You can add verbosity with `-v`, and change output with `--output <jsonFile>` like this :

```sh
# Change output JSON
$ ink-tools compile .\ink\story-basic.ink -v --output .\myStory.json

=== Start compilation ===
[info] Ink name file: story-basic.ink
[info] Ink path file: D:\6i\ink-tools\ink\story-basic.ink
[info] Output JSON: D:\6i\ink-tools\myStory.json
[info] Inklecate bin: D:\6i\ink-tools\bin\inklecate\inklecate_win.exe
[info] Ink compilation is starting.
[success] Inklecate compilation has finished !
```

### Watch for ink file change

To enable watch mode, just add `--watch` option in `compile` command. 

```sh
$ ink-tools compile .\ink\story-basic.ink --watch -v
```

The program can listen for ink file changes and start compilation each time it detects changement. It use an MD5 checksum of the file in order to check if the file has really changed.

![ink-tools CLI application](./doc/ink-tools_watch.gif)


## Ink story

[Ink](http://www.inklestudios.com/ink) is [inkle](http://www.inklestudios.com)'s scripting language for writing interactive narrative, both for text-centric games as well as more graphical games that contain highly branching stories. It's designed to be easy to learn, but with powerful enough features to allow an advanced level of structuring.

## License
Release under [MIT](./LICENSE.md) license.

## Copyright
Copyright (c) 2020 by 2o1oo <vb20100bv@gmail.com>