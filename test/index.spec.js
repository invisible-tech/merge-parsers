'use strict'

const assert = require('assert')
const path = require('path')
const peg = require('pegjs-import')

const parsers = require('../index.js')

describe('parsers', () => {
  it('should return the filenames as keys', () => {
    const parser = parsers()

    const actual = Object.keys(parser)
    const expected = ['eol', 'whitespace']
    assert.deepStrictEqual(actual, expected, 'it does not return the filename as a key')
  })

  it('should return a function', () => {
    const actual = parsers()

    const expected = 'function'
    assert.deepStrictEqual(typeof actual.whitespace, expected, 'it does not return a function as expected')
  })

  it('should throw when gracefulness is disabled', () => {
    const graceful = false

    const parser = parsers({ graceful })

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
    const graceful = true

    const parser = parsers({ graceful })
    const actual = parser.whitespace('2')

    const expected = undefined
    assert.deepStrictEqual(actual, expected, 'it does not fail gracefully returning undefined')
  })

  it('should return a list with parsed elements', () => {
    const testFilePath = './test/parsers/whitespace.pegjs'
    const name = path.parse(testFilePath).name
    const text = '    '

    const parser = parsers()

    const actual = parser[name](text)
    const expected = peg.buildParser(testFilePath).parse(text)
    assert.deepStrictEqual(actual, expected, 'it does not return a list with parsed elements')
  })
})
