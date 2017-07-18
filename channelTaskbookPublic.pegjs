@import '~/src/parsers/helpers/eol.pegjs' as EOL

taskbook = 'taskbooks' EOL { return true }
