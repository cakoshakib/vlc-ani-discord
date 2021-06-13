const fetch = require('node-fetch')
const config = require('../utils/config')

const getData = async (query, variables) => {
  const url = 'https://graphql.anilist.co',
    options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: variables
      })
    };

  const response = await fetch(url, options)
  const data = await response.json()
  
  return data
}

const userWatchingList = async () => {
  var query = `
  query ($page: Int, $perPage: Int, $userName: String) {
    Page (page: $page, perPage: $perPage) {
      mediaList (userName: $userName, status: CURRENT) {
        mediaId
        media {
          title {
            english
          }
        }
        progress
      }
    }
  }
  `;

  var variables = {
    page: 1,
    perPage: 20,
    userName: config.ANILIST_USER,
  };

  const data = await getData(query, variables)

  return data.data.Page.mediaList
}

const mediaIdList = async (title) => {
  var query = `
  query ($id: Int, $page: Int, $perPage: Int, $search: String) {
    Page (page: $page, perPage: $perPage) {
      media (id: $id, search: $search) {
        id
        title {
          english 
        }
      }
    }
  }
  `
    
  var variables = {
    search: title,
    page: 1,
    perPage: 5
  };

  const data = await getData(query, variables)
  
  return data.data.Page.media
}

const getMediaId = async (title) => {
  const watchingList = await userWatchingList()
  const mediaList = await mediaIdList(title)
  const userMediaIds = watchingList.map(media => media.mediaId)
  const mediaIds = mediaList.map(media => media.id) 

  for (let i in userMediaIds) {
    for (let j in mediaIds) {
      if (userMediaIds[i] === mediaIds[j])
        return userMediaIds[i]
    }
  }
}

const updateEpisodeCount = async (mediaId, episode) => {
  const query = `
  mutation ($mediaId: Int, $progress: Int) {
    SaveMediaListEntry (mediaId: $mediaId, progress: $progress) {
        id
        progress
    }
  }
  `
  
  const variables = {
    mediaId: mediaId,
    progress: episode
  }

  const url = 'https://graphql.anilist.co',
    options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.ANILIST_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: variables
      })
    };

  const response = await fetch(url, options)
  const data = await response.json()
  
  return data
  
}

getMediaId('A Certain Scientific').then(res => updateEpisodeCount(res, 6).then(data => console.log(data)))
