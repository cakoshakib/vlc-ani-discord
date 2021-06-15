const axios = require('axios')
const config = require('./utils/config')
const convert = require('xml-js')

const getXMLString = async () => {
  const baseUrl = `http://localhost:${config.VLC_PORT}/requests/status.xml`

  const response = await axios.get(baseUrl, {
    auth: {
      username: '',
      password: config.VLC_PW
    }
  })

  return response.data
}

const convertXML = (xmlString) => {
  const options = {
    compact: true,
    spaces: 4,
    trim: true,
    ignoreDeclaration: true,
    ignoreInstruction: true,
    ignoreComment: true,
    ignoreCdata: true,
    ignoreDoctype: true,
  };

  return convert.xml2json(xmlString, options)
}

const getTitle = (xmlObject) => {
  const metaData = xmlObject.information.category[0]
  const attributes = metaData.info.map(element => element._attributes.name)
  const names = metaData.info.map(element => element._text)
  
  if(attributes.includes('title')) {
    return names[attributes.indexOf('title')]
  } else if (attributes.includes('filename')) {
    return names[attributes.indexOf('filename')]
  }

  return ''
}

const getStatus = async () => {
  let xmlString
  try {
    xmlString = await getXMLString()
  } catch (error) {
    return null
  }
  const xmlObject = JSON.parse(convertXML(xmlString)).root

  try {
    const status = {
      'title': getTitle(xmlObject),
      'length': xmlObject.length._text,
      'time': xmlObject.time._text,
      'state': xmlObject.state._text,
    }
    return status
  } catch (error) {
    return null
  }
}

module.exports = getStatus