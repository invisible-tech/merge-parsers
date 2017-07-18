code
  = text:(chr chr chr) { return text.join('').toLowerCase() }

chr
 = [a-z]i
