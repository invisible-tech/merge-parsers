'use strict'

const assert = require('assert')
const path = require('path')
const peg = require('@invisible/pegjs-import')
const {
  isEmpty,
} = require('lodash/fp')

const parsers = require('../') // eslint-disable-line unicorn/import-index

describe('parsers', () => {
  it('should return the filenames as keys', () => {
    const testPath = './parsers'

    const parser = parsers({ path: testPath })

    const actual = Object.keys(parser)
    const expected = ['eol', 'whitespace']
    assert.deepStrictEqual(actual, expected, 'it does not return the filenames as keys')
  })

  it('should work with absolute paths', () => {
    const testPath = path.join(__dirname, 'parsers')

    const parser = parsers({ path: testPath })

    const actual = Object.keys(parser)
    const expected = ['eol', 'whitespace']
    assert.deepStrictEqual(actual, expected, 'it does not work with absolute path')
  })

  it('should throw with an invalid directory', () => {
    const testPath = 'a/invalid/directory'

    assert.throws(() => parsers({ path: testPath }))
  })

  it('should return an empty array for directories without any .pegjs files', () => {
    const testPath = './'

    const actual = parsers({ path: testPath })

    assert(isEmpty(actual), 'it does not return an empty array as expected')
  })

  it('should return a function', () => {
    const testPath = './parsers'

    const actual = parsers({ path: testPath })

    const expected = 'function'
    assert.deepStrictEqual(typeof actual.whitespace, expected, 'it does not return a function as expected')
  })

  it('should throw when gracefulness is disabled', () => {
    const testPath = './parsers'
    const graceful = false

    const parser = parsers({ graceful, path: testPath })

    assert.throws(() => parser.whitespace('2'))
  })

  it('should return undefined when gracefulness is enabled', () => {
    const testPath = './parsers'
    const graceful = true

    const parser = parsers({ graceful, path: testPath })

    const actual = parser.whitespace('2')
    const expected = undefined
    assert.deepStrictEqual(actual, expected, 'it does not fail gracefully returning undefined')
  })

  it('should return the parser\'s output', () => {
    const testPath = './parsers'
    const testFilePath = './test/parsers/whitespace.pegjs'
    const fileName = path.parse(testFilePath).name
    const text = '    '

    const parser = parsers({ path: testPath })

    const actual = parser[fileName](text)
    const expected = peg.buildParser(testFilePath).parse(text)
    assert.deepStrictEqual(actual, expected, 'it does not return the parsed output')
  })
})
