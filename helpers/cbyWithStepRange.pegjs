@import '~/src/parsers/helpers/whitespace.pegjs' as _
@import '~/src/parsers/helpers/code.pegjs' as code
@import '~/src/parsers/helpers/stepRange.pegjs' as stepRange

cbyWithStepRange
  = _ code:code _ stepRange:stepRange? {
    let startStep, endStep
    if (stepRange) { ({ startStep, endStep } = stepRange) }
    return {
      code,
      startStep,
      endStep,
    }
  }

