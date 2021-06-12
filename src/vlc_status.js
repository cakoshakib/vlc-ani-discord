const vlc = require('vlc.js');
const config = require('./utils/config')

const client = new vlc.Client({ address: 'localhost', password: config.VLC_PW, port: config.VLC_PORT});

module.exports =
  getStatus = async () => {
    let status = null
    try {
      status = await client.getStatus()
    } catch (e) {
      console.log('Error retrieving VLC status')
    }
    return status
  }