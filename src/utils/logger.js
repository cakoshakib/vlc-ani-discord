const curTime = () => {
  const now = new Date()
  return now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()
}

const info = (...params) => {
  const output = [`[${curTime()}]`, ...params]
  console.log(...output)
}

const error = (...params) => {
  const output = [`[${curTime()}]`, ...params]
  console.log(...output)
}

module.exports = {
  info, error
}