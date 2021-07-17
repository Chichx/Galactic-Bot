// Roll command
const { MessageEmbed } = require("discord.js");
const Keyv = require("keyv");
const prefixes = new Keyv("sqlite://db.sqlite");
const { PREFIX } = require("../../config.json");


module.exports = {
	name: '8ball',
  description: '8ball command',
  usage: '<Pregunta>',
  cooldown: 5,
  guildOnly: true,
    async execute(client, message, args) 
    
    {
    if (!args.length)
      return message.reply(`Por favor especifica una pregunta.\nFormato: \`${(await prefixes.get(message.guild.id)) || PREFIX}8ball <Pregunta>\``).catch(console.error);
      
        try
        {
    const pregunta = args.join(" ");

                        const responses = ["Si.", "No.", "No lo se", "100% seguro de que si.", "100% seguro de que no.", "Puede ser.", "Tal vez."];

            const result = Math.floor((Math.random() * responses.length));

    let helpEmbed = new MessageEmbed()
      .setTitle("Gaston Bot 8ball")
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(`**Pregunta:**\n${pregunta}\n\n**Respuesta:**\n**${responses[result]}**`)
      .setColor("GREEN")
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
      .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
       message.channel.send(helpEmbed)
        }
        catch(error)
        {
            console.log(error);
            return message.channel.send(error);
        }
    },
};