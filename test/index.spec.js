'use strict'

const assert = require('assert')
const path = require('path')
const peg = require('pegjs-import')

const parsers = require('../index.js')

describe('parsers', () => {
  it('should return the filenames as keys', () => {
    const testPath = './test/parsers'

    const parser = parsers({ path: testPath })

    const actual = Object.keys(parser)
    const expected = ['eol', 'whitespace']
    assert.deepStrictEqual(actual, expected, 'it does not return the filenames as keys')
  })

  it('should return a function', () => {
    const testPath = './test/parsers'

    const actual = parsers({ path: testPath })

    const expected = 'function'
    assert.deepStrictEqual(typeof actual.whitespace, expected, 'it does not return a function as expected')
  })

  it('should throw when gracefulness is disabled', () => {
    const testPath = './test/parsers'
    const graceful = false

    const parser = parsers({ graceful, path: testPath })

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

  it('should return undefined when gracefulness is enabled', () => {
    const testPath = './test/parsers'
    const graceful = true

    const parser = parsers({ graceful, path: testPath })

    const actual = parser.whitespace('2')
    const expected = undefined
    assert.deepStrictEqual(actual, expected, 'it does not fail gracefully returning undefined')
  })

  it('should return the parses output', () => {
    const testPath = './test/parsers'
    const testFilePath = './test/parsers/whitespace.pegjs'
    const fileName = path.parse(testFilePath).name
    const text = '    '

    const parser = parsers({ path: testPath })

    const actual = parser[fileName](text)
    const expected = peg.buildParser(testFilePath).parse(text)
    assert.deepStrictEqual(actual, expected, 'it does not return the parsed output')
  })
})
