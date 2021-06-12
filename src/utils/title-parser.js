const removeBracketed = (title) => {
  return title.replace(/ *\[[^)]*\] */g, "")
}

const removeParends = (title) => {
  return title.replace(/ *\([^)]*\) */g, "")
}

const splitDash = (title) => {
  return {
    'title': title.substring(0, title.indexOf('-')).trim(),
    'details': title.substring(title.indexOf('-') + 1).trim()
  }
}

const parseTitle = (title) => {
  let parsedTitle = title

  if (title.includes(']')) {
    parsedTitle = removeBracketed(parsedTitle)
  }

  if (title.includes(')')) {
    parsedTitle = removeParends(parsedTitle)
  }

  if (title.includes('-')) {
    return splitDash(parsedTitle)
  }

  return {
    'title': parsedTitle,
  }
}

module.exports = parseTitle
