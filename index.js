'use strict'

const assert = require('assert')
const glob = require('glob')
const path = require('path')
const peg = require('pegjs-import')
const fs = require('fs')

const { assign } = require('lodash/fp')

const testPath = (...args) => {
  const dirPath = path.join(...args)
  fs.readdirSync(dirPath)
  return dirPath
}

const resolveDir = dirPath => {
  try {
    // Use given path if it is a reachable directory.
    return testPath(dirPath)
  } catch (e) {
    try {
      // If not, look inside node_modules.
      return testPath('node_modules', dirPath)
    } catch (err) {
      throw Error('The given path is an invalid directory.')
    }
  }
}

const listPegjsFiles = cwd =>
  glob.sync('*.pegjs', { cwd, nodir: true })
    .map(f => path.join(cwd, f))

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

const parsers = ({ path: dirPath, graceful = true, pegOptions } = {}) => {
  assert.strictEqual(typeof dirPath, 'string', 'the path directory must be a string.')
  assert.strictEqual(typeof graceful, 'boolean', 'the graceful option must be a boolean.')
  const cwd = resolveDir(dirPath)
  const filesArray = listPegjsFiles(cwd)

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
