// Converts generated authorization code into usable JWT token

const request = require('request')
const config = require('../../utils/config')

const options = {
  uri: 'https://anilist.co/api/v2/oauth/token',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  json: {
    'grant_type': 'authorization_code',
    'client_id': `${config.ANILIST_ID}`,
    'client_secret': `${config.ANILIST_SECRET}`,
    'redirect_uri': `${config.ANILIST_REDIRECT}`, // http://example.com/callback
    'code': `${config.ANILIST_AUTH}`, // The Authorization Code received previously
  }
};

request(options, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body.access_token);
  }
});
