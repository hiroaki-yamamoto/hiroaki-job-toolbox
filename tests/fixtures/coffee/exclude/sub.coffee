module.exports.sub =  (a, b) ->
  if a < b
    throw new Error 'Parameter a must be larger than / equal to b'
