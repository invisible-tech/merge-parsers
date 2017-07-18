'use strict'

const peg = require('pegjs-import')

const fs = require('fs')
const path = require('path')
const {
  flow,
  filter,
  map,
  flatten,
} = require('lodash/fp')

const helpersDir = 'helpers'
const isPegjsFile = f => /.+\.pegjs$/i.test(f)

const dirs = [
  __dirname,
  path.join(__dirname, `./${helpersDir}`),
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

function parsers({ makeGracefulActive = true }) { files.reduce((acc, file,) => {
  const name = path.parse(file).name
  if (makeGracefulActive) {
    const parser = flow(peg.buildParser, makeGraceful)(file)
    return Object.assign(acc, { [name]: parser })
  } else {
    const parser = peg.buildParser(file)
    return Object.assign(acc, { [name]: parser })
  }
  
}, {})}

module.exports = parsers
