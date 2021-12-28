const removeBracketed = (title) => {
  return title.replace(/[\s_.]*\[[^\]]*\][\s_.]*/g, "");
};

const removeParends = (title) => {
  return title.replace(/ *\([^)]*\) */g, "");
};

const validEp = (episode) => {
  return episode && !isNaN(episode[1]);
};

const getEpisode = (details) => {
  let parts = [details];

  if (details.includes("-")) {
    parts = parts.concat(details.substring(0, details.indexOf("-")).trim());
    parts = parts.concat(details.substring(details.indexOf("-") + 1).trim());
  }

  for (let part of parts) {
    // ep1, episode 1, e1
    let match = part.match(/(episode\s?|ep|e)(\d+)/i);
    if (match && !isNaN(match[2]))
      return [part.replace(match[0], ""), match[2]];
    // 5x3 (season 5 ep 3)
    match = part.match(/\d+x(\d+)/i);
    if (validEp(match)) return [part.replace(match[0], ""), match[1]];
    // 1v3 (episode 1 season 3)
    match = part.match(/(\d+)v\d+/i);
    if (validEp(match)) return [part.replace(match[0], ""), match[1]];
    // 1 (just the number, at the end)
    match = part.match(/(\d+)$/i);
    if (validEp(match)) return [part.replace(match[0], ""), match[1]];
    // 1 (just the number, anywhere)
    match = part.match(/(\d+)/i);
    if (validEp(match)) return [part.replace(match[0], ""), match[1]];
  }

  return [parts, ""];
};

const splitDash = (title) => {
  const parsedTitle = title.substring(0, title.indexOf("-")).trim();
  const details = title.substring(title.indexOf("-") + 1).trim();

  const episode = getEpisode(title)[1];

  return {
    title: parsedTitle,
    details: details,
    episode: episode,
  };
};

const removeFileExtension = (title) => {
  return title.substring(0, title.lastIndexOf("."));
};

const replaceDelimiter = (title) => {
  return title.replace(/\./g, " ").replace(/\_/g, " ");
};

const parseTitle = (title) => {
  let parsedTitle = title;
  title = title.trim();

  // Special ' character
  if (title.includes("&#39;")) {
    parsedTitle = parsedTitle.replace("&#39;", "'");
  }

  if (title.includes(".mkv") || title.includes(".mp4")) {
    parsedTitle = removeFileExtension(parsedTitle);
  }

  if (title.includes("]")) {
    parsedTitle = removeBracketed(parsedTitle);
  }

  if (title.includes(")")) {
    parsedTitle = removeParends(parsedTitle);
  }

  if (!parsedTitle.includes(" ")) {
    parsedTitle = replaceDelimiter(parsedTitle);
  }

  if (title.includes("-")) {
    return splitDash(parsedTitle);
  }

  const info = getEpisode(parsedTitle);

  return {
    title: info[0].trim(),
    episode: info[1].trim(),
  };
};

module.exports = parseTitle;
