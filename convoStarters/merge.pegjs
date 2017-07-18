@import '~/src/parsers/helpers/whitespace.pegjs' as _
@import '~/src/parsers/helpers/eol.pegjs' as EOL
@import '~/src/parsers/helpers/slackChannel.pegjs' as slackChannel
@import '~/src/parsers/helpers/gmailId.pegjs' as gmailId

start =
  merge gmailId:gmailId into? _ slackChannel:slackChannel _ EOL
    { return Object.assign({ gmailId }, slackChannel) }
/ merge gmailId:gmailId _ EOL
    { return { gmailId } }
/ merge .* _ EOL { return {} }

merge = 'merge'i (_ ('thread'i/'email'i))? _
into = _ 'into'i _
