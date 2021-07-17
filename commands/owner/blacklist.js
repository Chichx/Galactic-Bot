const Discord = require('discord.js')
const db = require('quick.db')
const config = require("../../config.json");

module.exports = {
    name: 'blacklist',
    description: 'Blacklist command',
    usage: '<@Usuario>',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args) {
        if(message.author.id !== config.ownerID) {
            return message.channel.send("No eres el creador del Bot.");
          }
            let User = await message.mentions.members.first() || message.guild.members.cache.get(args[0])
            let noUser = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.avatarURL({
                    dynamic: true
                }))
                .setColor("RED")
                .setDescription('Por favor menciona a un usuario')
                .addField("Uso:", '`blacklist <user> `')
                .setFooter(message.client.user.username, message.client.user.avatarURL())

            if (!User) return message.channel.send(noUser)

            let checkingBlacklisted = db.fetch(`blacklisted_${User.id}`)

            if(checkingBlacklisted === true){
                let alreadyBlacklisted = new Discord.MessageEmbed()
                .setDescription('El usuario ya esta blacklisteado!')
                .setAuthor(message.author.username, message.author.avatarURL({
                    dynamic: true
                }))
                .setColor("RED")
                .setFooter(message.client.user.username, message.client.user.avatarURL())

            return message.channel.send(alreadyBlacklisted)
}

            db.set(`blacklisted_${User.id}`, true)
            let blacklistedEmbed = new Discord.MessageEmbed()
                .setDescription('Blacklisteaste a un nuevo usuario **' + User + '**')
                .setAuthor(message.author.username, message.author.avatarURL({
                    dynamic: true
                }))
                .setColor("GREEN")
                .setFooter(message.client.user.username, message.client.user.avatarURL())

            message.channel.send(blacklistedEmbed)

           
            
        } 
    }
