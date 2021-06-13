// Generates and opens authentication URL to retrieve Code

const config = require('../../utils/config')
const logger = require('../../utils/logger')
const open = require('open')

const baseUrl = 'https://anilist.co/api/v2/oauth/authorize'

const client_id = config.ANILIST_ID

const redirect_uri = config.ANILIST_REDIRECT

const completeUrl = `${baseUrl}?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code`

open(completeUrl)

logger.info(completeUrl)