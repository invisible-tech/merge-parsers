'use strict'

const assert = require('assert')
const glob = require('glob')
const path = require('path')
const peg = require('pegjs-import')

const {
  assign,
} = require('lodash/fp')

const listPegjsFiles = dir =>
  glob.sync('*.pegjs', { cwd: dir, nodir: true })
    .map(f => path.join(dir, f))

// Makes a parser fail gracefully
const makeGraceful = parser => {
  const parse = text => {
    // We try & catch here so parsers return undefined instead of throwing and crashing
    try {
      return parser.parse(text)
    } catch (e) {
      return undefined
    }
  }
  return { parse }
}

const parsers = ({ path: pathDir, graceful = true, pegOptions } = {}) => {
  assert.strictEqual(typeof pathDir, 'string', 'the path directory must be a string.')
  assert.strictEqual(typeof graceful, 'boolean', 'the graceful option must be a boolean.')
  const filesArray = listPegjsFiles(pathDir)

  return filesArray.reduce((acc, file) => {
    const { name: fileName } = path.parse(file)
    const buildParser = peg.buildParser(file, pegOptions)
    const { parse } = (graceful)
      ? makeGraceful(buildParser)
      : buildParser
    return assign(acc)({ [fileName]: parse })
  }, {})
}

module.exports = parsers
