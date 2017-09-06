# merge-parsers

Generate parsers for each `.pegjs` file in a directory. Accepts `@import` syntax from pegjs-import.

## Install

`npm install merge-parsers`

or

`yarn add merge-parsers`

## Usage
```js
const mergeParsers = require('merge-parsers')

const parsers = mergeParsers({ path: './parsers' }) // path contains foo.pegjs and bar.pegjs

parsers.foo() // calls the `foo` parser
parsers.bar() // calls the `bar` parser
```

## Options

- graceful - Instead of raising an error, it fails gracefully returning `undefined`. (default)

- pegOptions - Options object passed through to `pegjs`.

    * See [pegjs](https://github.com/pegjs/pegjs) for more information!

## Miscellaneous information

The module searches for the given path inside the current project directory and if doesn't find it, it tries to search inside `node_modules`.
```
first -> try to search 'path/to/your/parsers/directory'
if not found -> try to search 'node_modules/path/to/your/parsers/directory'
```
- This is useful if you use symlinks inside `node_modules` to your project main directory, for example.

## Issues

Any issue, please, contact us on [Github](https://github.com/invisible-tech/merge-parsers/issues)!
