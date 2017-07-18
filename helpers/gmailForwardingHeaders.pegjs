// Parse HTML Mail for GMail's header for message in thread
// e.g. const mailString = `<div dir=\"ltr\"><br><div class=\"gmail_quote\">---------- Forwarded message ----------<br>From: <b class=\"gmail_sendername\">Gunar Gessner</b> <span dir=\"ltr\">&lt;gunar@invisible.email&gt;</span><br>Date: Thu, May 12, 2016 at 7:27 PM<br>Subject: OOOOo<br>To: Nylas Test2 &lt;nylas2@invisible.email&gt;<br><br><br><div dir=\"ltr\">OOOO</div>\n</div><br></div>

{
  const { flow, flatten, isUndefined, join, reject } = require('lodash/fp')
  // Negative lookahead: http://stackoverflow.com/a/12244637
  const lookahead = flow(flatten, reject(isUndefined), join(''))
}

start = headers:gmailHeader* .* { return headers }

gmailHeader = (!header .)* header:header { return header }

header = '<div class=' q 'gmail_quote' q '>' span? '---------- Forwarded message ----------<br>' name:name ' <span dir=' q 'ltr' q '>' email:email '</span><br>' date:date subject:subject to:to { return { from: { name, email }, date, to, subject } }
span = '<span class=\"\">'

// e.g. Gunar Gessner
name = 'From: <b class=' q 'gmail_sendername' q '>' name:(!'</b>' .)* '</b>' { return lookahead(name) }

// e.g. gunar@invisible.email or <a href="mailto:gunar@invisible.email" target="_blank">gunar@invisible.email</a>
email = emailWithLink
      / emailPlainText

emailWithLink =  lt? '<a href=' q 'mailto:' email:(!q .)+  (!'</a>' .)* '</a>' gt? { return lookahead(email) }
emailPlainText = lt email:(!'&gt;' .)* gt { return lookahead(email) }

// e.g. Thu, May 12, 2016 at 7:27 PM
date = 'Date: ' date:(!'<br>' .)* '<br>' { return lookahead(date) }

// e.g. Infos for client
subject = 'Subject: ' subject:(!'<br>' .)+ '<br>' { return lookahead(subject) }

// e.g. 'To: Nylas Test2 &lt;nylas2@invisible.email&gt;'
to = 'To: ' name:(!email .)+ email:email { return { name: lookahead(name), email } }

lt = '&lt;'
gt = '&gt;'
// quote (escaped or not)
q = '\"'
  / '"'
  / '3D"'
