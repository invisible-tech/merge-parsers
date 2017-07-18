@import '~/src/parsers/helpers/whitespace.pegjs' as _
@import '~/src/parsers/helpers/slackChannel.pegjs' as slackChannel

start
  = 'buffer'i _ channel:slackChannel? { return channel || true }
