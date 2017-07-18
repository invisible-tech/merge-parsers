{
  const {
    AFFIRMATIVE,
    NEGATIVE,
  } = require('~/src/parsers/constants')
}

@import '~/src/parsers/helpers/whitespace.pegjs' as _

start
  = _ yes _ strong? _ { return AFFIRMATIVE }
  / _ no _ strong? _ { return NEGATIVE }

strong = [!1 ]+

// If you put 'y' before 'yes' it breaks
yes = 'affirmative'i
    / 'confirm'i
    / 'amen'i
    / 'cool'i
    / 'fine'i
    / 'good'i
    / 'true'i
    / 'yeah'i
    / 'yea'i
    / 'yes'i
    / 'yup'i
    / 'ok'i
    / 'ya'i
    / 'y'i
    / 'k'i

no = 'negative'i
   / 'cancel'i
   / 'no way'i
   / 'false'i
   / 'never'i
   / 'nein'i
   / 'nope'i
   / 'nah'i
   / 'no'i
   / 'n'i
