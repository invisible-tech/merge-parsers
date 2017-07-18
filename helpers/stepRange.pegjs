@import '~/src/parsers/helpers/whitespace.pegjs' as _
@import '~/src/parsers/helpers/stepName.pegjs' as stepName

stepRange =
  _ removeRangeWords _ startStep:stepName _ removeRangeWords _ endStep: stepName _ {
    return {
      startStep,
      endStep,
    }
  }

removeRangeWords
  = ('from'i
    / 'to'i
    / '\-'i)* { return '' }