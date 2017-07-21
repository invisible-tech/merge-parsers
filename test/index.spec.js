'use strict'

const assert = require('assert')
const parsers = require('../index.js')

describe('parsers', () => {
  it('returns the filename as a key', () => {
    const peg = require('pegjs')
    const pathdir = './helpers/'

    const parser = parsers({ peg, pathdir })
    const actual = Object.keys(parser)

    const expected = ['whitespace'] // it only has whitespace in this directory. Would I use fs and path to get the name?
    assert.deepStrictEqual(actual, expected, 'it does not return the filename as a key')
  })

  it('returns a function as value of the parser', () => {
    const peg = require('pegjs')
    const pathdir = './helpers/'

    const actual = parsers({ peg, pathdir })

    const expected = 'function'
    assert.deepStrictEqual(typeof actual.whitespace, expected, '')
  })

  it('disables graceful', () => {
    const peg = require('pegjs')
    const pathdir = './helpers/'
    const graceful = false

    const parser = parsers({ peg, pathdir, graceful })

    const parses = text => {
      try {
        return parser.whitespace(text)
      } catch (e) {
        return e.name
      }
    }
    const actual = parses('2') // there are other possible errors? How to handle this?
    const expected = 'SyntaxError'
    assert.strictEqual(actual, expected, 'the error was supposed to be a SyntaxError')
  })

  it('returns the text parsed', () => {
    const peg = require('pegjs')
    const pathdir = './helpers/'

    const parser = parsers({ peg, pathdir })
    const actual = parser.whitespace('    ')

    const expected = [' ', ' ', ' ', ' ']
    assert.deepStrictEqual(actual, expected, 'it does not return the text parsed in a proper way')
  })

  it('returns undefined for wrong text to parse', () => {
    const peg = require('pegjs')
    const pathdir = './helpers/'
    const graceful = true

    const parser = parsers({ peg, pathdir, graceful })
    const actual = parser.whitespace('2')

    const expected = undefined
    assert.deepStrictEqual(actual, expected, 'it does not fail gracefully returning undefined')
  })
})
