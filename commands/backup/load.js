const Discord = require('discord.js');
const backup = require('discord-backup');

module.exports = {
    name: 'load',
    description: 'Backup server',
    usage: '<ID>',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args) {
    if(!message.member.hasPermission('ADMINISTRATOR')){
        return message.channel.send(":x: No tienes permiso para usar este comando");
    }

    const backup_id = args[0];

    backup.fetch(backup_id).then(async () => {
        // If the backup exists, request for confirmation
        const confirm_embed = new Discord.MessageEmbed()
            .setColor("#ff0015")
            .setTitle("Galactic Backup")
            .setDescription("\\⚠️ Se cargo correctamente el backup, si quiere usarlo escribe el comando `confirmar` para confirmar!")
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
      .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setTimestamp();
        message.channel.send(confirm_embed);

        await message.channel.awaitMessages(m => (m.author.id === message.author.id) && (m.content === "confirmar"), {
            max: 1,
            time: 20000,
            errors: ["time"]
        }).catch(async (err) => {
            // if the author of the commands does not confirm the backup loading
            const unconfirmed_embed = new Discord.MessageEmbed()
                .setColor("#ff0015")
            .setTitle("Galactic Bot")
                .setDescription("\\❌ El tiempo expiró, el backup fue cancelado.")
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
      .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setTimestamp();
            return message.channel.send(unconfirmed_embed);
        });
        // When the author of the command has confirmed that he wants to load the backup on his server
        const confirmed_embed = new Discord.MessageEmbed()
            .setColor("#ff0015")
            .setTitle("Galactic Backup")
            .setDescription("\\✅ Se esta iniciando el backup!")
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
      .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setTimestamp();
        message.author.send(confirmed_embed);
        // Load the backup
        backup.load(backup_id, message.guild).then(async () => {
            const loaded_embed = new Discord.MessageEmbed()
                .setColor("#ff0015")
            .setTitle("Galactic Backup")
                .setDescription("\\✅ Backup cargado correctamente!")
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
      .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setTimestamp();
            return message.author.send(loaded_embed);
        }).catch(async (err) => {
            const load_err_embed = new Discord.MessageEmbed()
                .setColor("#ff0015")
            .setTitle("Gaston Bot")
                .setDescription("\\❌ Error al cargar el backup, verifique si tengo los permisos de ADMINISTRATOR!")
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
      .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setTimestamp();
            return message.author.send(load_err_embed);
        });
    }).catch(async (err) => {
        const find_err_embed = new Discord.MessageEmbed()
            .setColor("#ff0015")
            .setTitle("Galactic Backup")
            .setDescription(`❌ No tienes ningun backup con esta ID: ${backup_id}!`)
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
      .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setTimestamp();
        return message.channel.send(find_err_embed);
    });
}};
