const Discord = require("discord.js");
const Keyv = require("keyv");
const prefixes = new Keyv("sqlite://db.sqlite");
const { PREFIX } = require("../../config.json");

module.exports = {
    name: 'clear',
    description: 'Clear command',
    usage: '<Numero>',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args) {
      if (!message.member.hasPermission("MANAGE_MESSAGES")) {  
          const notUse = new Discord.MessageEmbed()
              .setColor("#E74C3C")
              .setDescription(`:x: **Tu no tienes permiso para usar el comando __CLEAR__**`)
              .setTimestamp()
              .setAuthor(message.author.tag, message.author.displayAvatarURL())
              .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
              .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
          return message.channel.send(notUse);
        } 
        const amount = parseInt(args[0]) + 1;
        if (isNaN(amount) || amount < 1 || amount > 100) {
       message.channel.send(`Por favor especifica un numero del 1 al 99.\nFormato: \`${(await prefixes.get(message.guild.id)) || PREFIX}clear [numero]\``)
return;
        }
        message.channel.bulkDelete(amount, true).catch(err => {
            console.error(err);
            message.channel.send(`No puedo eliminar mensaje que sean de hace 2 semanas`);
return;
        });
        let clearembed = new Discord.MessageEmbed()
            .setColor('#00ffbb')
            .setTitle(`Mensajes Borrados`)
            .addFields(
                { name: 'Borrados por:', value: `${message.author}` },
                { name: 'Cantidad de mensajes borrados:', value: `${amount}` },
                { name: 'Canal:', value: `${message.channel}` }
            )
              .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
              .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
            .setTimestamp();
         message.channel.send(clearembed);
    }
}