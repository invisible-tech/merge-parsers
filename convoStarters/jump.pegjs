@import '~/src/parsers/helpers/stepName.pegjs' as stepName
@import '~/src/parsers/helpers/whitespace.pegjs' as _

start
  = 'jump'i _ stepName:stepName? {
    return { stepName }
  }
