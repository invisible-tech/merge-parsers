'use strict'

const assert = require('assert')
const fs = require('fs')
const path = require('path')
const {
  assign,
  flow,
  filter,
  map,
  flatten,
  partialRight,
} = require('lodash/fp')

const isPegjsFile = f => /.+\.pegjs$/i.test(f)

const listFilesInDirectory = dir =>
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
const listPegjsFiles = dirs => flow(
  map(readdirSyncFilePaths),
  flatten,
  filter(f => isPegjsFile(f))
)(dirs)

const turnFileIntoGrammar = file => fs.readFileSync(file, 'utf8')

const parsers = ({ peg = true, pegimport = false, pathdir = './parsers', graceful = true, pegOptions = false } = {}) => {
  assert.strictEqual(typeof pathdir, 'string', 'the path directory must be a string.')
  assert.strictEqual(typeof graceful, 'boolean', 'the graceful option must be a boolean.')
  const parsersPath = pathdir
  const dirs = listFilesInDirectory(parsersPath)
  const filesArray = listPegjsFiles(dirs)

  return filesArray.reduce((acc, file) => {
    if (pegimport) {
      const name = path.parse(file).name
      const gracefulParser = flow(peg.buildParser, makeGraceful)(file)
      const nonGracefulParser = peg.buildParser(file).parse
      const parser = (graceful) ? gracefulParser : nonGracefulParser
      return assign(acc)({ [name]: parser })
    }

    const name = path.parse(file).name
    const buildParser = partialRight(peg.generate)([pegOptions])
    const gracefulParser = flow(turnFileIntoGrammar, buildParser, makeGraceful)(file)
    const nonGracefulParser = flow(turnFileIntoGrammar, buildParser)(file).parse
    const parser = (graceful) ? gracefulParser : nonGracefulParser
    return assign(acc)({ [name]: parser })
  }, {})
}

module.exports = parsers
