const DiscordRPC = require('discord-rpc')
const config = require('./utils/config')
const status = require('./vlc')
const titleParser = require('./utils/title_parser')
const ani = require('./api/anilist')
const anilistUpdate = require('./api/anilist')

const rpc = new DiscordRPC.Client({ transport: 'ipc' });

const clientId = config.DISCORD_CLIENTID;

const savedInfo = {
  title: '',
  episode: '',
}

let updateAni = true

const setStatus = async () => {
  const vlc_status = await status()
  if (vlc_status === null) {
    rpc.clearActivity()
    return
  }
  const parsedTitle = titleParser(vlc_status.title)
  const stateCapitalized = vlc_status.state.charAt(0).toUpperCase() + vlc_status.state.slice(1)

  if (savedInfo.title !== parsedTitle.title || savedInfo.episode !== parsedTitle.episode) {
    savedInfo.title = parsedTitle.title
    savedInfo.episode = parsedTitle.episode
    updateAni = true
  }
  
  const activity = {
    details: parsedTitle.title,
    state: stateCapitalized,
    instance: true,
    largeImageKey: 'rem',
    largeImageText: 'Weeb Trash',
  }
  
  if (parsedTitle.episode) {
    activity.state += ` - Episode ${parsedTitle.episode}`
  }
  
  const currentEpochSeconds = Date.now() / 1000
  if (vlc_status.state == 'playing') {
    const timeRemaining = Math.round(currentEpochSeconds + (vlc_status.length - vlc_status.time))
    activity.endTimestamp = timeRemaining
  } 

  if ((vlc_status.length - vlc_status.time) < 480 && updateAni) {
    console.log('Attempting to update anilist...')
    await ani.anilistUpdate(parsedTitle.title, Number(parsedTitle.episode))
    updateAni = false
  }
  
  rpc.setActivity(activity);
}

rpc.on('ready', () => {
  console.log('Logged in as', rpc.user.username)
  

  setStatus()
  setInterval(() => {
    setStatus()
  }, 15e3)
});

rpc.login({ clientId }).catch(console.error);
