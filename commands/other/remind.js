const Discord = require("discord.js")
const ms = require("ms")
const db = require("quick.db")
const moment = require('moment');


module.exports = {
    name: 'remind',
    description: 'Remind command',
    usage: '<Duración> || <Razón>',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args) {
let timeuser = args[0]
let reason = args.slice(1).join(" ")

if(!timeuser) return message.reply(":x: Escribe una duración: **10s, 10h, 20d**")
if(!reason) return message.reply(":x: Escribe una razón para tu recordatorio.")

db.set(`remind.${message.author.id}`,Date.now() + ms(timeuser))
message.channel.send(`Te mandare un mensaje cuando tu recordatorio termine.\nRazón: **${reason}**\nDuración: ${moment(Date.now() + ms(args[0])).format('MMMM Do YYYY, h:mm:ss a')}`)
const interval = setInterval(function() {


    if(Date.now() > db.fetch(`remind.${message.author.id}`)){
        db.delete(`remind.${message.author.id}`)
        message.channel.send(`${message.author}, **Tu Recordatorio:** ${reason}`)
        .catch(e => console.log(e))
        clearInterval(interval)
    }

},1000)
}}
