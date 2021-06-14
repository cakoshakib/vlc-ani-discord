// Converts generated authorization code into usable JWT token

const axios = require('axios')
const config = require('../../utils/config')
const logger = require('../../utils/logger')

const options = {
  url: 'https://anilist.co/api/v2/oauth/token',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  data: {
    'grant_type': 'authorization_code',
    'client_id': `${config.ANILIST_ID}`,
    'client_secret': `${config.ANILIST_SECRET}`,
    'redirect_uri': `${config.ANILIST_REDIRECT}`, // http://example.com/callback
    'code': `${config.ANILIST_AUTH}`, // The Authorization Code received previously
  }
};

axios(options).then((response) => {
  if (response.status == 200) {
    logger.info(response.data.access_token)
  } else {
    logger.info(response)
  }
});
