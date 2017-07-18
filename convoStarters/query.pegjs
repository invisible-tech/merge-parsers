@import '~/src/parsers/helpers/whitespace.pegjs' as _

start
  = 'query'i type:type? argument:argument? { return { type, argument } }

type
  = _ t:('CLT'i / 'AGT'i / 'CBY'i) { return t.toUpperCase() }

argument
  = _ arg:.* { return arg.join('') }
