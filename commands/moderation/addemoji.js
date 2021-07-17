const Discord = require("discord.js");
const { parse } = require("twemoji-parser");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "addemoji",
  description: 'Addemoji command',
  usage: '<Emoji>',
  cooldown: 5,
  guildOnly: true,
  async execute(client, message, args) {
    if (!message.member.hasPermission("MANAGE_EMOJIS")) {
      return message.channel.send(
        ":x: Tu no tienes permisos para usar este comando."
      );
    }

    if (!message.guild.me.hasPermission("MANAGE_EMOJIS")) {
      return message.channel.send(
        "No tengo permisos para agregar EMOJIS, agregamelos y vuelvelo a intentar."
      );
    }

            let emojis = args.slice(0);
            let msg = [];
            if(!args[0]) {
                return message.channel.send('Pone un emoji o muchos!');
            }

            for(i=0; i<emojis.length; i++) {
                let emoji = Discord.Util.parseEmoji(emojis[i]);
                if(emoji.id === undefined || emoji.id === null) {
                    message.channel.send("`" + emojis[i] + "` el emoji no es valido");
                    break;
                }
                let emojiURL; 
                let emojiExtention = "";
                emoji.animated ? emojiExtention = ".gif" : emojiExtention = ".png";
                emojiURL = "https://cdn.discordapp.com/emojis/"+emoji.id+emojiExtention+"?v=1";

                message.guild.emojis.create(emojiURL, emoji.name)
                .then(emoji => message.channel.send("<a:check:859215524122329088> Agregado: "+ emoji.toString()))
                .catch(error => {
                    if(error.code === 30008) {
                        message.channel.send(error.message);
                    }
                });                

            }
        }
}