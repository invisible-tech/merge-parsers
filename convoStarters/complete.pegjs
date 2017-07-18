start
  = 'complete'i text:text? { return { text } }

text
  = ' ' arg:.* { return arg.join('') }
