#!/usr/bin/env node

'use strict'

const shell = require('shelljs')

shell.echo('postinstall.js starting')

if (! shell.test('-e', 'node_modules/~')) {
  shell.echo('creating wavy symlink')
  shell.ln('-sf', '../', 'node_modules/~')
}

shell.echo('postinstall.js done')
