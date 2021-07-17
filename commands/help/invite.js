const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "invite",
  description: 'Invite command',
  usage: '',
  cooldown: 5,
  guildOnly: true,
  execute(client, message) {
    let commands = message.client.commands.array();

    let inviteEmbed = new MessageEmbed()
      .setTitle("Galactic Invite")
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setURL("https://discord.com/api/oauth2/authorize?client_id=744656460826411152&permissions=8&scope=bot")
      .setColor("RANDOM")
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
      .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
      .setTimestamp();

    return message.channel.send(inviteEmbed).catch(console.error);
  }
};
