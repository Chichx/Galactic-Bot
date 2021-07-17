const Discord = require('discord.js');
const backup = require('discord-backup');

module.exports = {
    name: 'backupinfo',
    description: 'Backup server',
    usage: '<ID>',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args) {
    // If the member doesn't have enough permissions
    if(!message.member.hasPermission('MANAGE_MESSAGES')){
        return message.channel.send(':x: No tienes permiso para usar este comando.');
    }

    const backupID = args.join(' ');

    if (!backupID)
        return message.channel.send(':x: Especifica la ID del backup!');

    backup.fetch(backupID).then((backup) => {

        const date = new Date(backup.data.createdTimestamp);
        const yyyy = date.getFullYear().toString(), mm = (date.getMonth()+1).toString(), dd = date.getDate().toString();
        const formattedDate = `${yyyy}/${(mm[1]?mm:"0"+mm[0])}/${(dd[1]?dd:"0"+dd[0])}`;

        const embed = new Discord.MessageEmbed()
            .setAuthor('ℹ️ Backup', backup.data.iconURL)
            .setColor("RANDOM")
            .addField('Server', backup.data.name)
            .addField('Peso', backup.size + ' kb')
            .addField('Creado', formattedDate)
            .setFooter('Backup ID: '+backup.id);

        return message.channel.send(embed);

    }).catch((err) => {

        if (err === 'No backup found')
            return message.channel.send(':x: No se encontro el backup '+backupID+'!');
        else
            return message.channel.send(':x: An error occurred: '+(typeof err === 'string') ? err : JSON.stringify(err));

    });

}};