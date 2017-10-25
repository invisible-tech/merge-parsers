# @invisible/merge-parsers

[![CircleCI](https://circleci.com/gh/invisible-tech/merge-parsers/tree/master.svg?style=svg)](https://circleci.com/gh/invisible-tech/merge-parsers/tree/master)

Generate parsers for each `.pegjs` file in a directory. Accepts `@import` syntax from pegjs-import.

## Install

`npm install @invisible/merge-parsers`

or

`yarn add @invisible/merge-parsers`

## Usage
```js
// src/parsers/index.js
const mergeParsers = require('@invisible/merge-parsers')

const parsers = mergeParsers({ path: './rules' }) // path contains foo.pegjs and bar.pegjs

parsers.foo() // calls the `foo` parser
parsers.bar() // calls the `bar` parser
```

## Options

- path - Absolute or relative path to parsers rules directory.

- graceful - Instead of raising an error, it fails gracefully returning `undefined`. (default)

- pegOptions - Options object passed through to `pegjs`.

    * See [pegjs](https://github.com/pegjs/pegjs) for more information!

## Miscellaneous information

The module uses relative paths from the file that called the function.

## Issues

Any issue, please, contact us on [Github](https://github.com/invisible-tech/merge-parsers/issues)!
