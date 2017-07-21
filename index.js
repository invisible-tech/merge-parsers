'use strict'

const assert = require('assert')
const fs = require('fs')
const path = require('path')
const {
  flow,
  filter,
  map,
  flatten,
  partialRight,
} = require('lodash/fp')

const isPegjsFile = f => /.+\.pegjs$/i.test(f)

const findFilesInDirectory = dir =>
  [
    __dirname,
    path.join(__dirname, `./${dir}`),
  ]

// Get an array of the full file paths of all files in the dir
const readdirSyncFilePaths = dir => map(f => path.join(dir, f))(fs.readdirSync(dir))

// Makes a parser fail gracefully
const makeGraceful = parser =>
  text => {
    // We try & catch here so parsers return undefined instead of throwing and crashing
    try {
      return parser.parse(text)
    } catch (e) {
      return undefined
    }
  }

// Load the files in
const files = flow(
  map(readdirSyncFilePaths),
  flatten,
  filter(f => isPegjsFile(f))
)(dirs)

const parsers = files.reduce((acc, file) => {
  const name = path.parse(file).name
  const parser = flow(peg.buildParser, makeGraceful)(file)
  return Object.assign(acc, { [name]: parser })
}, {})

module.exports = parsers
