'use strict'

const assert = require('assert')
const fs = require('fs')
const glob = require('glob')
const path = require('path')
const peg = require('@invisible/pegjs-import')

const assertValidPath = dirPath => {
  try {
    fs.readdirSync(dirPath)
    return dirPath
  } catch (err) {
    throw Error('The given path is an invalid directory.')
  }
}

const listPegjsFiles = rulesDir =>
  glob.sync('*.pegjs', { cwd: rulesDir, nodir: true })
    .map(f => path.join(rulesDir, f))

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

const buildRelativePath = dirPath => {
  const parentDirPath = path.dirname(module.parent.filename)
  return path.join(parentDirPath, dirPath)
}

const parsers = ({ path: dirPath, graceful = true, pegOptions } = {}) => {
  assert.strictEqual(typeof dirPath, 'string', 'the path directory must be a string.')
  assert.strictEqual(typeof graceful, 'boolean', 'the graceful option must be a boolean.')
  const relativePath = buildRelativePath(dirPath)
  assertValidPath(relativePath)
  const filesArray = listPegjsFiles(relativePath)

  return filesArray.reduce((acc, file) => {
    const { name: fileName } = path.parse(file)
    const buildParser = peg.buildParser(file, pegOptions)
    const { parse } = (graceful)
      ? makeGraceful(buildParser)
      : buildParser
    return { ...acc, [fileName]: parse }
  }, {})
}

module.exports = parsers
