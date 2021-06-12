const vlc = require('vlc.js')
require('dotenv').config()

const client = new vlc.Client({ address: 'localhost', password: process.env.VLC_PW, port: process.env.VLC_PORT});
client.getStatus()
    .then((status) => {
      console.log('Status of the VLC', status)
    })
