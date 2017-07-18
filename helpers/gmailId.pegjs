gmailId =
  gmailURL:gmailURL { return gmailURL }
/ id:([0-9a-z]+) { return id.join('') }

gmailURL = '<'? http? 'mail.google.com/mail' [^#]* '#' [^/]* '/' gmailId:[0-9a-z]+ '>'? { return gmailId.join('') }
http = 'http' 's'? '://'
