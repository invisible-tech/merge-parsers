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
const files = dirs => flow(
  map(readdirSyncFilePaths),
  flatten,
  filter(f => isPegjsFile(f))
)(dirs)

const turnFileIntoGrammar = file => fs.readFileSync(file).toString() // dont look for dependencies and dont remove comments.

const parsers = ({ peg = true, pathdir = './parsers', graceful = true, pegOptions = false } = {}) => { // peg = require('./node_modules/pegjs') -> pass linting
  assert.strictEqual(typeof pathdir, 'string', 'the path directory must be a string.')
  assert.strictEqual(typeof graceful, 'boolean', 'the graceful option must be a boolean.')
  const parsersPath = pathdir // pathdir = './myParsers' // without '../.' + -> for tests.
  const dirs = findFilesInDirectory(parsersPath)
  const filesArray = files(dirs)

  return filesArray.reduce((acc, file) => {
    const name = path.parse(file).name
    const buildParser = partialRight(peg.generate)([pegOptions])
    const parserWithGraceful = flow(turnFileIntoGrammar, buildParser, makeGraceful)(file)
    const parserWithoutGraceful = flow(turnFileIntoGrammar, buildParser)(file).parse
    const parser = (graceful) ? parserWithGraceful : parserWithoutGraceful
    return Object.assign(acc, { [name]: parser })
  }, {})
}

const peg = require('pegjs')
const pathdir = './helpers'
let testParser = parsers({ peg, pathdir, graceful: true })

console.log(testParser.whitespace(' '))

module.exports = parsers
