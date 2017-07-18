@import '~/src/parsers/helpers/whitespace.pegjs' as _

start
  = 'set'i _ name:name? _ value:value? { return { name, value } }

name = x:[a-zA-Z0-9.]+ { return x.join('') }

value = x:.+ { return x.join('').trim() }
