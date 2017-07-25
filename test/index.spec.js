'use strict'

const assert = require('assert')
const fs = require('fs')
const parsers = require('../index.js')
const path = require('path')
const {
  flow,
} = require('lodash/fp')

describe('parsers', () => {
  it('returns the filename as a key', () => {
    const peg = require('pegjs')
    const pathdir = './helpers/'

    const parser = parsers({ peg, pathdir })
    const actual = Object.keys(parser)

    const expected = ['eol', 'whitespace']
    assert.deepStrictEqual(actual, expected, 'it does not return the filename as a key')
  })

  it('returns a parser function', () => {
    const peg = require('pegjs')
    const pathdir = './helpers/'

    const actual = parsers({ peg, pathdir })

    const expected = 'function'
    assert.deepStrictEqual(typeof actual.whitespace, expected, 'it does not return a function as expected')
  })

  it('should return an error by disabling graceful of parser', () => {
    const peg = require('pegjs')
    const pathdir = './helpers/'
    const graceful = false

    const parser = parsers({ peg, pathdir, graceful })

    const parses = text => {
      try {
        return parser.whitespace(text)
      } catch (e) {
        return new Error(`This is a ${e.name} error`)
      }
    }
    const actual = parses('2')

    assert(actual instanceof Error, `should throw an error but is returning ${actual}`)
  })

  it('returns undefined when graceful is active for a wrong text input', () => {
    const peg = require('pegjs')
    const pathdir = './helpers/'
    const graceful = true

    const parser = parsers({ peg, pathdir, graceful })
    const actual = parser.whitespace('2')

    const expected = undefined
    assert.deepStrictEqual(actual, expected, 'it does not fail gracefully returning undefined')
  })

  it('returns the text parsed', () => {
    const peg = require('pegjs')
    const pathdir = './helpers/'
    const testFileDir = './helpers/whitespace.pegjs'
    const name = path.parse(testFileDir).name
    const text = '    '

    const parser = parsers({ peg, pathdir })
    const actual = parser[name](text)

    const turnFileIntoGrammar = file => fs.readFileSync(file, 'utf8')
    const expected = flow(turnFileIntoGrammar, peg.generate)(testFileDir).parse(text)
    assert.deepStrictEqual(actual, expected, 'it does not return the text parsed in a proper way')
  })

  it('should work with pegjs-import', () => {
    const peg = require('pegjs-import')
    const pegimport = true
    const pathdir = './helpers/'
    const graceful = true
    const testFileDir = './helpers/whitespace.pegjs'
    const name = path.parse(testFileDir).name
    const text = '    '

    const parser = parsers({ peg, pegimport, pathdir, graceful })
    const actual = parser[name](text)

    const expected = peg.buildParser(testFileDir).parse(text)
    assert.deepStrictEqual(actual, expected, 'it does not return the text parsed in a proper way using pegjs-import')
  })
})
