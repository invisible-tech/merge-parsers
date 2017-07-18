@import '~/src/parsers/helpers/whitespace.pegjs' as _
@import '~/src/parsers/helpers/cbyWithStepRange.pegjs' as cbyWithStepRange

start
  = head:'run'i _ tail:cbyWithStepRange? {
    if (tail) return tail
    return true
  }
