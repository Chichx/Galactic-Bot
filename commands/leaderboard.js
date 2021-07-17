const Discord = require("discord.js");
const SQLite = require("better-sqlite3");
const sql = new SQLite('./mainDB.sqlite')
const client = new Discord.Client();

module.exports = {
    name: 'leaderboard',
    description: 'Leaderboard command',
    usage: '',
    cooldown: 5,
    guildOnly: true,
    execute(client, message, args) {

    const icon = message.guild.iconURL({ dynamic: true });
    const top10 = sql.prepare("SELECT * FROM levels WHERE guild = ? ORDER BY totalXP DESC LIMIT 10;").all(message.guild.id);

        const embed = new Discord.MessageEmbed()
        .setTitle(`${message.guild.name} Tabla de 10 mejores`)
        .setColor("RANDOM")
        .setTimestamp()
      .setThumbnail(icon)
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
        .setDescription(`Tabla de 10 mejores`);


      for(const data of top10) {
          let xp = data.xp;
          let level = data.level;
          let nextXP = level * 2 * 250 + 250
          let totalXP = data.totalXP
          let user = data.user
          let rank = top10.sort((a, b) => {
            return b.totalXP - a.totalXP
          });
          let ranking = rank.map(x => x.totalXP).indexOf(totalXP) + 1

        embed.addFields({ name: `\u200b`, value: `**#${ranking}. <@${user}>**\n> **Nivel**: \`${level}\`\n> **XP**: \`${xp}/${nextXP}\`\n> **Total XP**: \`${totalXP}\`` });
      }
      return message.channel.send({embed});
    }
}