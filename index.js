'use strict'

const assert = require('assert')
const fs = require('fs')
const path = require('path')
const peg = require('pegjs-import')

const {
  assign,
  flow,
  filter,
  map,
  flatten,
  partialRight,
} = require('lodash/fp')

const isPegjsFile = f => /.+\.pegjs$/i.test(f)

// Get an array of the full file paths of all files in the dir
const readdirSyncFilePaths = dir => map(f => path.join(dir, f))(fs.readdirSync(dir))

// Load the files in
const listPegjsFiles = dirs => flow(
  map(readdirSyncFilePaths),
  flatten,
  filter(f => isPegjsFile(f))
)([dirs])

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

const parsers = ({ path: pathdir = `${__dirname}/../../src/parsers`, graceful = true, pegOptions } = {}) => {
  assert.strictEqual(typeof pathdir, 'string', 'the path directory must be a string.')
  assert.strictEqual(typeof graceful, 'boolean', 'the graceful option must be a boolean.')
  const filesArray = listPegjsFiles(pathdir)

  return filesArray.reduce((acc, file) => {
    const { name: fileName } = path.parse(file)
    const buildParser = partialRight(peg.buildParser)([pegOptions])
    const parser = (graceful) ?
      flow(buildParser, makeGraceful)(file) :
      buildParser(file).parse
    return assign(acc)({ [fileName]: parser })
  }, {})
}

module.exports = parsers
