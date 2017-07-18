@import '~/src/parsers/helpers/whitespace.pegjs' as _
@import '~/src/parsers/helpers/eol.pegjs' as EOL
@import '~/src/parsers/helpers/slackChannel.pegjs' as slackChannel
@import '~/src/parsers/helpers/gmailId.pegjs' as gmailId
@import '~/src/parsers/helpers/code.pegjs' as code

start =
  forward gmailId:gmailId _ to? _ code:code
    { return { gmailId, code } }
/ forward .* _ EOL
    { return {} }

forward = 'forward'i (_ ('thread'i/'email'i))? _
to = _ 'to'i _
