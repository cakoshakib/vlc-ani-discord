require('dotenv').config()


const VLC_PW = process.env.VLC_PW
const VLC_PORT = process.env.VLC_PORT || 8080

const DISCORD_CLIENTID = '853338108045426688'

const ANILIST_AUTH = process.env.ANILIST_AUTH
const ANILIST_ID = process.env.ANILIST_CLIENT_ID
const ANILIST_SECRET = process.env.ANILSIT_CLIENT_SECRET
const ANILIST_REDIRECT = process.env.ANILIST_REDIRECT
const ANILIST_USER = '1mp'

module.exports = {
  VLC_PW,
  VLC_PORT,
  DISCORD_CLIENTID,
  ANILIST_AUTH,
  ANILIST_ID,
  ANILIST_REDIRECT,
  ANILIST_SECRET,
  ANILIST_USER
}