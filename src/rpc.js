const DiscordRPC = require('discord-rpc')
const config = require('./utils/config')
const status = require('./vlc')
const titleParser = require('./utils/title_parser')
const ani = require('./api/anilist')
const logger = require('./utils/logger')

const rpc = new DiscordRPC.Client({ transport: 'ipc' });

const clientId = config.DISCORD_CLIENTID;

const savedInfo = {
  title: '',
  episode: '',
}

let updateAni = true

const setStatus = async () => {
  // Retrieve VLC Status
  const vlc_status = await status()
  if (vlc_status === null) {
    logger.error('Error retrieving VLC status')
    rpc.clearActivity()
    return
  }

  // Format status information
  const parsedTitle = titleParser(vlc_status.title)
  const stateCapitalized = vlc_status.state.charAt(0).toUpperCase() + vlc_status.state.slice(1)

  // Check if AniList needs to potentially be updated again
  if (savedInfo.title !== parsedTitle.title || savedInfo.episode !== parsedTitle.episode) {
    savedInfo.title = parsedTitle.title
    savedInfo.episode = parsedTitle.episode
    updateAni = true
  }
  
  const icons = ['emilia', 'rem', 'kallen', 'lelouch', 'subaru', 'khun', 'lloyd', 'yuji', 'zenitsu', 'tanjiro', 'gojo', 'arima', 'kaori', 'senku', 'mayuri', 'okabe', 'killua', 'gon', 'levi', 'mikasa', 'eren', 'norman', 'armin', 'garfiel', 'mob']
  const randPick = Math.floor(Math.random() * icons.length)
  
  // Discord Rich Presence Activity
  const activity = {
    details: parsedTitle.title,
    state: stateCapitalized,
    instance: true,
    largeImageKey: icons[randPick],
    largeImageText: 'Weeb Trash',
  }
  
  // Add episode information to RPC
  if (parsedTitle.episode) {
    activity.state += ` - Episode ${parsedTitle.episode}`
  }
  
  // Time remaining in Anime
  const currentEpochSeconds = Date.now() / 1000
  if (vlc_status.state == 'playing') {
    const timeRemaining = Math.round(currentEpochSeconds + (vlc_status.length - vlc_status.time))
    activity.endTimestamp = timeRemaining
  } 

  // Update AniList when Anime is close to finishing
  if ((vlc_status.length - vlc_status.time) < 480 && updateAni) {
    logger.info('Attempting to update anilist...')
    try {
      await ani.anilistUpdate(parsedTitle.title, Number(parsedTitle.episode))
    } catch (e) {
      logger.error('An error occurred, is this Anime in your watching list?')
    }
    updateAni = false
  }
  
  // Set Discord Rich Presence
  rpc.setActivity(activity);
}

rpc.on('ready', () => {
  logger.info('Logged in as', rpc.user.username)

  setStatus()
  setInterval(() => {
    setStatus()
  }, 15e3)
});

rpc.login({ clientId }).catch(console.error);
