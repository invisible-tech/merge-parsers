'use strict'

const assert = require('assert')
const fs = require('fs')
const pathLib = require('path')
const glob = require('glob')
const peg = require('@invisible/pegjs-import')

const isValidPath = path => {
  try {
    fs.readdirSync(path)
    return path
  } catch (err) {
    return undefined
  }
}

const buildAbsolutePath = path => {
  const parentDirPath = pathLib.dirname(module.parent.filename)
  return pathLib.join(parentDirPath, path)
}

const resolveDir = path => {
  const absolutePath = pathLib.isAbsolute(path) ? path : buildAbsolutePath(path)
  if (! isValidPath(absolutePath)) throw Error('The given path isnt valid.')

  return absolutePath
}

const listPegjsFiles = rulesDir =>
  glob.sync('*.pegjs', { cwd: rulesDir, nodir: true })
    .map(f => pathLib.join(rulesDir, f))

// Makes a parser fail gracefully
const makeGraceful = parser => {
  const parse = text => {
    // We try & catch here so parsers return undefined instead of throwing and crashing
    try {
      return parser.parse(text)
    } catch (err) {
      return undefined
    }
  }
  return { parse }
}

const parsers = ({ path, graceful = true, pegOptions } = {}) => {
  assert.strictEqual(typeof path, 'string', 'the path directory must be a string.')
  assert.strictEqual(typeof graceful, 'boolean', 'the graceful option must be a boolean.')
  const validDirPath = resolveDir(path)
  const filesArray = listPegjsFiles(validDirPath)

  return filesArray.reduce((acc, file) => {
    const { name: fileName } = pathLib.parse(file)
    const buildParser = peg.buildParser(file, pegOptions)
    const { parse } = (graceful)
      ? makeGraceful(buildParser)
      : buildParser
    return { ...acc, [fileName]: parse }
  }, {})
}

module.exports = parsers
