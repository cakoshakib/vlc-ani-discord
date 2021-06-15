const removeBracketed = (title) => {
  return title.replace(/[\s_.]*\[[^\]]*\][\s_.]*/g, "")
}

const removeParends = (title) => {
  return title.replace(/ *\([^)]*\) */g, "")
}

const validEp = (episode) => {
  return episode && !isNaN(episode[1])
}

const getEpisode = (details) => {
  details = details.toLowerCase()
  let parts = [details]
  
  if (details.includes('-')) {
    parts = parts.concat(details.substring(0, details.indexOf('-')).trim())
    parts = parts.concat(details.substring(details.indexOf('-') + 1).trim())
  }

  
  for (let part of parts) {
    // ep1, episode 1, e1
    let match = part.match(/(episode|ep|e)\s?(\d+)/)
    if (match && !isNaN(match[2])) return match[2]
    // 5x3 (season 5 ep 3)
    match = part.match(/x(\d+)/)
    if (validEp(match)) return match[1]
    // 1v3 (episode 1 season 3)
    match = part.match(/(\d+)v/)
    if (validEp(match)) return match[1]
    // 1 (just the number)
    match = part.match(/(\d+)$/)
    if (validEp(match)) return match[1]
  }

  return ''
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

  if (title.includes('.mkv') || title.includes('.mp4')) {
    parsedTitle = removeFileExtension(parsedTitle)
  }

  if (title.includes(']')) {
    parsedTitle = removeBracketed(parsedTitle)
  }

  if (title.includes(')')) {
    parsedTitle = removeParends(parsedTitle)
  }

  if (!parsedTitle.includes(' ')) {
    parsedTitle = replaceDelimiter(parsedTitle)
  }

  if (title.includes('-')) {
    return splitDash(parsedTitle)
  }

  const ep = getEpisode(parsedTitle)

  return {
    'title': parsedTitle,
    'episode': ep
  }
}

module.exports = parseTitle
