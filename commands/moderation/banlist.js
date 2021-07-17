const Discord = require("discord.js");

module.exports = {
    name: 'banlist',
    description: 'Banlist command',
    usage: '',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args) {

    message.delete();

      if (!message.member.hasPermission("BAN_MEMBERS")) {  
          const notUse = new Discord.MessageEmbed()
              .setColor("#E74C3C")
              .setDescription(`:x: **Tu no tienes permiso para usar el comando __BANLIST__**`)
              .setTimestamp()
              .setAuthor(message.author.tag, message.author.displayAvatarURL())
              .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
              .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
          return message.channel.send(notUse);
        } 


    let banM = (await message.guild.fetchBans()).size;

    let i0 = 0;
    let i1 = 10;
    let page = 1;

    let description =
      `Miembros Baneados - ${banM}\n\n` +
      (await message.guild.fetchBans())
        .map(u => u)
        .map((u, i) => `**${i + 1}** - ${u.user.username} - **${u.user.id}**`)
        .slice(0, 10)
        .join("\n \n");

    let embed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setColor("RANDOM")
              .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
      .setThumbnail(message.guild.iconURL({format: 'png', dynamic: true, size: 1024}))
      .setTitle(`Pagina - ${page}/${Math.ceil(banM / 10)}`)
      .setDescription(description);

    let msg = await message.channel.send(embed);

    await msg.react("⬅");
    await msg.react("➡");
    await msg.react("❌");

    let collector = msg.createReactionCollector(
      (reaction, user) => user.id === message.author.id
    );

    collector.on("collect", async (reaction, user) => {
      if (reaction._emoji.name === "⬅") {
        i0 = i0 - 10;
        i1 = i1 - 10;
        page = page - 1;

        if (i0 + 1 < 0) {
          console.log(i0)
          return msg.delete();
        }
        if (!i0 || !i1) {
          return msg.delete();
        }

        let description =
        `Miembros Baneados - ${banM}\n\n` +
        (await message.guild.fetchBans())
          .map(u => u)
          .map((u, i) => `**${i + 1}** - ${u.user.username} - **${u.user.id}**`)
          .slice(i0, i1)
          .join("\n \n");
  

        embed
          .setTitle(`Pagina - ${page}/${Math.round(banM / 10 + 1)}`)
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setColor("RANDOM")
              .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
          .setThumbnail(message.guild.iconURL({format: 'png', dynamic: true, size: 1024}))
          .setDescription(description);
        msg.edit(embed);
      }

      if (reaction._emoji.name === "➡") {
        i0 = i0 + 10;
        i1 = i1 + 10;
        page = page + 1;

        if (i1 > banM + 10) {
          return msg.delete();
        }
        if (!i0 || !i1) {
          return msg.delete();
        }

        let description =
        `Miembros Baneados - ${banM}\n\n` +
        (await message.guild.fetchBans())
          .map(u => u)
          .map((u, i) => `**${i + 1}** - ${u.user.username} - **${u.user.id}**`)
          .slice(i0, i1)
          .join("\n \n");
  

        embed
          .setTitle(`Pagina - ${page}/${Math.round(banM / 10 + 1)}`)
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setColor("RANDOM")
              .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
          .setThumbnail(message.guild.iconURL({format: 'png', dynamic: true, size: 1024}))
          .setDescription(description);
        msg.edit(embed);
      }

      if (reaction._emoji.name === "❌") {
        return msg.delete();
      }

      await reaction.users.remove(message.author.id);
    });
}};
