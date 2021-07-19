const backup = require("discord-backup");
const config = require("../../config.json");

module.exports = {
    name: 'backuplist',
    description: 'Unban command',
    usage:  '',
    cooldown: 10,
    guildOnly: true,
    async execute(client, message, args) {

        if(message.author.id !== config.ownerID) {
            return message.channel.send("No eres el creador del Bot.");
          }

    backup.list().then((backups) => {
   message.channel.send(`Todos los backups: ${backups}`)
    console.log(backups); 
    
});
}}