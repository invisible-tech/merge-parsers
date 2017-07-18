@import '~/src/parsers/helpers/whitespace.pegjs' as _
@import '~/src/parsers/helpers/code.pegjs' as code

start
  = 'playbook'i _ command:command? _ code:code? _ spreadsheetUrl:spreadsheetUrl? _ force:force? {
    let documentId = null, worksheetId = null, url = null
    if (spreadsheetUrl) {
      ({ documentId, worksheetId, url } = spreadsheetUrl)
    }
    return {
      code,
      command,
      documentId,
      force,
      url,
      worksheetId,
    }
  }

command
  = s:('load'i / 'list'i) {
    return s.toLowerCase()
  }

force = 'force'i { return true }

// See: https://developers.google.com/sheets/guides/concepts
// example: https://docs.google.com/spreadsheets/d/1_0XVVuqbcsjYkI8B6Hp2Re3VkzdIoTj_B20tqST9r7E/edit?hl=en#gid=2067872167
spreadsheetUrl
  = '<'? http? 'docs.google.com/spreadsheets/d/' documentId:[a-zA-Z0-9-_]+ '/edit' (!'#' .)* '#' 'gid=' worksheetId:[0-9]+ '>'?{
    return {
      documentId: documentId.join(''),
      worksheetId: worksheetId.join(''),
      url: `https://docs.google.com/spreadsheets/d/${documentId.join('')}/edit?hl=en#gid=${worksheetId.join('')}`
    }
  }

http = 'http' 's'? '://'
