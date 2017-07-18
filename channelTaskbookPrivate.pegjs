@import '~/src/parsers/helpers/eol.pegjs' as EOL

taskbook = 'inb-' [a-z]+ '-taskbooks' EOL { return true }
