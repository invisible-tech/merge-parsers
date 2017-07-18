parser
  = slackChannel:slackChannel { return slackChannel }

// Channel names can only contain lowercase letters, numbers, hyphens, and underscores, and must be 21 characters or less.
// https://api.slack.com/methods/channels.rename
slackChannel = slackChannelLink / slackChannelPlain
slackChannelPlain = '#' name:([a-z0-9-]+) { return '#' + name.join('') }
slackChannelLink = '<#' id:slackChannelId '|' name:[^>]+ '>' {
  return {
    channelId: id,
    channelName: name.join(''),
  }
}

slackChannelId = 'C' id:[0-9A-Z]+ { return 'C' + id.join('') }
