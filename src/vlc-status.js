const vlc = require('vlc.js');
const config = require('./utils/config')

const client = new vlc.Client({ address: 'localhost', password: config.VLC_PW, port: config.VLC_PORT});

getStatus = async () => {
  const status = await client.getStatus()
  console.log(status)
}

getStatus()
module.exports =
  getStatus = async () => {
    try {
      const status = await client.getStatus()
      return status
    } catch (e) {
      return null
    }
  }