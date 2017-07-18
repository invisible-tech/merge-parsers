stepName
  = S:'S'i num:[0-9]+ {
    return (S + num.join('')).toUpperCase()
  }
