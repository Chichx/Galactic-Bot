const Discord = require('discord.js');
const config = require('../config.json');
const ms = require('ms')
module.exports = {
  name: 'glist',
  description: 'List giveaway command',
  usage: '',
  cooldown: 5,
  guildOnly: true,
  async execute(client, message, args) {
    if (message.author.bot) return;
    let giveaways = client.giveawaysManager.giveaways.filter(g => g.guildID === `${message.guild.id}` && !g.ended)
    if (!Array.isArray(giveaways)) return message.channel.send('💥 No hay sorteos!')
    let embed = new Discord.MessageEmbed()
        .setTitle("Sorteos activos!")
        .setColor("GREEN")
        .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
        .setTimestamp()
    await Promise.all(giveaways.map(async (x) => {
        if (x.extraData) {
            const guild = client.guilds.cache.get(x.extraData.server)
            const channel = guild.channels.cache
                .filter((channel) => channel.type === 'text')
                .first()
            const inv = await channel.createInvite()
            await embed.addField(`Sorteo con requisito:`, `**Premio:** **[${x.prize}](https://discord.com/channels/${x.guildID}/${x.channelID}/${x.messageID})**\n**Requisito: [Server](${inv})**\n**Creado el: \`${new Date(x.startAt)}\`**\n**Termina el:** \`${new Date(x.endAt)}\`\n**Creador:** ${x.hostedBy}`)
        } else {
            embed.addField(`Sorteo Normal:`, `**Premio:** **[${x.prize}](https://discord.com/channels/${x.guildID}/${x.channelID}/${x.messageID})\nCreado el: \`${new Date(x.startAt)}\`**\n**Termina el:** \`${new Date(x.endAt)}\`\n**Creador:** ${x.hostedBy}`)
        }
    }));
    message.channel.send(embed)
}}