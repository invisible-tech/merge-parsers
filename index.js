'use strict'

const assert = require('assert')
const fs = require('fs')
const glob = require('glob')
const path = require('path')
const peg = require('pegjs-import')

const {
  assign,
  startsWith,
} = require('lodash/fp')

const testPath = (...dirPath) => {
  const dirPathToTest = path.join(process.cwd(), ...dirPath)
  try {
    fs.readdirSync(dirPathToTest)
    return dirPathToTest
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

const parsers = ({ path: dirPath = 'src/parsers', graceful = true, pegOptions } = {}) => {
  assert.strictEqual(typeof dirPath, 'string', 'the path directory must be a string.')
  assert.strictEqual(typeof graceful, 'boolean', 'the graceful option must be a boolean.')
  const rulesDir = startsWith('.')(dirPath) ? path.join('src/parsers', dirPath) : dirPath
  const testedDir = testPath(rulesDir)
  const filesArray = listPegjsFiles(testedDir)

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
