const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "roleinfo",
  description: 'Role info command',
  usage: '<@Role>',
  cooldown: 5,
  guildOnly: true,
  async execute(client, message, args) {
    const role = message.mentions.roles.first() || 
    message.guild.roles.cache.find(r => r.id === args[0]) || 
    message.guild.roles.cache.find(r => r.name === args.join(' '));
    if (!args[0]) return message.channel.send('Tienes que mencionar a un rango.');
    if (role) {
      const color = role.hexColor;
      const roleinfo = new MessageEmbed()
        .setColor(role.color)
        .addField('ID', role.id)
        .addField('Nombre', role.name, true)
        .addField('Color', (color != '#000000' ? color : 'Ninguno'), true)
        .addField('Mention', `\`<@&${role.id}>\``, true)
        .addField('Posición', role.position, true)
        .addField('Hoist', (role.hoist ? 'Sí' : 'No'), true)
        .addField('Mencionable', (role.mentionable ? 'Sí' : 'No'), true)
        .addField('Creado el', (role.createdAt), true)
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
      .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
      .setTimestamp();
      return (await message.channel.send(roleinfo));
    } else {
      const notfound = new MessageEmbed()
        .setTitle("Rango no encontrado")
        .setDescription('❌ No se encontro ninguna rango.')
        .setColor('#c90000')
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
      .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
      .setTimestamp();
      return (await message.channel.send(notfound));
    }  
  }
};