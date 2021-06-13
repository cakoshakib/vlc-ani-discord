const DiscordRPC = require('discord-rpc')
const config = require('./utils/config')
const status = require('./vlc_status')
const parser = require('./utils/title_parser')

const rpc = new DiscordRPC.Client({ transport: 'ipc' });

const clientId = config.DISCORD_CLIENTID;

const setStatus = async () => {
  const vlc_status = await status()
  if (vlc_status === null) {
    rpc.clearActivity()
    return
  }
  const unparsedTitle = vlc_status.title
  const stateCapitalized = vlc_status.state.charAt(0).toUpperCase() + vlc_status.state.slice(1)
  
  const parsedTitle = parser(unparsedTitle)
  
  const activity = {
    details: parsedTitle.title,
    state: stateCapitalized,
    instance: true,
    largeImageKey: 'rem',
    largeImageText: 'Weeb Trash',
  }
  
  if (parsedTitle.details) {
    activity.state += ` - ${parsedTitle.details}`
  }
  
  const currentEpochSeconds = Date.now() / 1000
  if (vlc_status.state == 'playing') {
    const timeRemaining = Math.round(currentEpochSeconds + (vlc_status.length - vlc_status.time))
    activity.endTimestamp = timeRemaining
  } 
  
  rpc.setActivity(activity);
}

rpc.on('ready', () => {
  console.log('logged in as', rpc.user.username)
});

rpc
  .login({ clientId })
  .then(() => {
    setInterval(setStatus, 5000);
  })
  .catch(console.error);
