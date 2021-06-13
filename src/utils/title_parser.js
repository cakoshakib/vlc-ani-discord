const removeBracketed = (title) => {
  return title.replace(/ *\[[^)]*\] */g, "")
}

const removeParends = (title) => {
  return title.replace(/ *\([^)]*\) */g, "")
}

const getEpisode = (details) => {
  const lowercaseDetails = details.toLowerCase()
  if (lowercaseDetails.includes('episode')) {
    return(details.substring(lowercaseDetails.lastIndexOf('episode') + 8).trim())
  } else if (lowercaseDetails.includes('ep')) {
    return(details.substring(lowercaseDetails.lastIndexOf('ep') + 2).trim())
  } else if (lowercaseDetails.includes('e')) {
    return(details.substring(lowercaseDetails.lastIndexOf('e') + 1).trim())
  } else if (!isNaN(details)) {
    return(details)
  }
}

const splitDash = (title) => {
  const parsedTitle = title.substring(0, title.indexOf('-')).trim()
  const details = title.substring(title.indexOf('-') + 1).trim()

  const episode = getEpisode(details)
  
  return {
    'title': parsedTitle,
    'details': details,
    'episode': episode
  }
}

const removeFileExtension = (title) => {
  return title.substring(0, title.lastIndexOf('.'))
}

const replaceDelimiter = (title) => {
  return title.replace(/\./g, ' ').replace(/\_/g, ' ')
}

const parseTitle = (title) => {
  let parsedTitle = title
  title = title.trim()

  if (title.includes(']')) {
    parsedTitle = removeBracketed(parsedTitle)
  }

  if (title.includes(')')) {
    parsedTitle = removeParends(parsedTitle)
  }

  if (title.includes('.mkv') || title.includes('.mp4')) {
    parsedTitle = removeFileExtension(parsedTitle)
  }

  if (!(parsedTitle.includes(' '))) {
    parsedTitle = replaceDelimiter(parsedTitle)
  }

  if (title.includes('-')) {
    return splitDash(parsedTitle)
  }


  return {
    'title': parsedTitle,
  }
}

module.exports = parseTitle
