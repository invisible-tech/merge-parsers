@import '~/src/parsers/helpers/whitespace.pegjs' as _
@import '~/src/parsers/helpers/eol.pegjs' as EOL

taskbook = header _ meta:meta _ body:body { return { meta, body } }

header = _ '*' _ 'Taskbook' _ '*' _

meta = fields:field+ {
  return fields.reduce((acc, next) =>
    Object.assign({}, acc, next))
  }

field = _ '_' key:([^|]+) '| ' value:([^_]+) '_' _ {
  return {
    [key.join('').toLowerCase()]: value.join('').trim(),
  }
}

body = all:.* { return all.join('') }
