const backup = require("discord-backup");

module.exports = {
    name: 'backupdelete',
    description: 'Backup server',
    usage: '<ID>',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args) {
        // Check member permissions
        if(!message.member.hasPermission("ADMINISTRATOR")){
            return message.channel.send(":x: No tienes permiso para usar este comando");
        }
        let backupID = args[0];
        if(!backupID){
            return message.channel.send(":x: Tienes que mencionar una ID valida del backup!");
        }else if(backupID){
            backup.remove(backupID) + message.channel.send(`:white_check_mark: Tu backup **${backupID}** fue eliminado correctamente.`)
        }
    }};