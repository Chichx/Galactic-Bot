const {  fetchTranscript } = require('reconlx')

 
//example
module.exports = {
  name : 'transcript',
  async execute(client, message) {
    fetchTranscript(message, 99, true)
  }
}