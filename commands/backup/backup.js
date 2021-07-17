const Discord = require('discord.js');
const backup = require('discord-backup');

module.exports = {
    name: 'backup',
    description: 'Backup server',
    usage: '',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args) {
    if(!message.member.hasPermission('ADMINISTRATOR')){
        return message.channel.send(":x: No tienes permiso para usar este comando.");
    }

    backup.create(message.guild, {
        jsonBeautify: true,
        saveImages: "base64"
    }).then(async (backupData) => {
        console.log(backupData);
        
        const msg_embed = new Discord.MessageEmbed()
            .setColor("#ff0015")
            .setTitle("Galactic Backup")
            .setDescription(`\\✅ Backup creado con exito, si quiere usarlo solo ponga =load ${backupData.id}`)
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
            .setTimestamp();

        message.channel.send(msg_embed)
    }).catch(async (err) => {
        const err_embed = new Discord.MessageEmbed()
            .setColor("#ff0015")
            .setTitle("Galactic Backup")
            .setDescription(`\\❌ Error al creado backup!\nIntente mas tarde.\n${err}`)
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
            .setTimestamp();

        message.channel.send(err_embed);
    });
}};