@import '~/src/parsers/helpers/whitespace.pegjs' as _

start
  = _ 'end'i _ { return true }
