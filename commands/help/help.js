const { MessageEmbed } = require("discord.js");
const Keyv = require("keyv");
const prefixes = new Keyv("sqlite://db.sqlite");
const { PREFIX } = require("../../config.json");
const db = require("quick.db")

module.exports = {
  name: "help",
  description: 'Help command',
  usage: '',
  cooldown: 5,
  guildOnly: true,
  async execute(client, message) {
    let commands = message.client.commands.array();

    let helpEmbed = new MessageEmbed()
      .setTitle("Galactic Help")
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(`[Invitación](https://galacticbot.xyz/invite) | [Servidor de Soporte](https://galacticbot.xyz/discord) | [Pagina Web](https://galacticbot.xyz/)\n\n**El prefix es** \`${(await prefixes.get(message.guild.id))|| PREFIX}\``)
      .setColor("#3ac1f4")
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
      .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
      .addField('🎵 Música', `\`${(await prefixes.get(message.guild.id)) || PREFIX}join\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}leave\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}loop\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}lyrics\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}nowplaying\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}pause\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}play\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}playlist\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}pruning\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}queue\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}remove\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}resume\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}search\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}shuffle\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}skip\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}skipto\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}stats\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}stop\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}volume\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}tts\``)
      .addField('🤖 Moderación', `\`${(await prefixes.get(message.guild.id))|| PREFIX}ban\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}banlist\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}unban\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}hackban\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}kick\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}mute\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}tempmute\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}unmute\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}clear\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}channellock\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}channelunlock\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}nuke\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}warn\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}warnings\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}removewarns\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}slowmode\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}set\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}blacklistwords\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}addcommand\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}removecommand\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}addemoji\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}setnickname\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}addrole\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}removerole\`\n**NOTA: Para que funcionen estos comandos tienes que setear el canal de logs**`)
      .addField('🎉 Sorteos', `\`${(await prefixes.get(message.guild.id))|| PREFIX}gcreate\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}gend\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}glist\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}greroll\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}gedit\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}gdelete\``)
      .addField(':computer: Backup', `\`${(await prefixes.get(message.guild.id))|| PREFIX}backup\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}load\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}backupdelete\``)
      .addField(':space_invader: Minigames', `\`${(await prefixes.get(message.guild.id))|| PREFIX}youtube-together\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}poker-night\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}betrayal-io\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}chess\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}fishington-io\``)
      .addField(':trophy: Niveles', `\`${(await prefixes.get(message.guild.id))|| PREFIX}rank\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}leaderboard\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}addlevel\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}rolelevel\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}setlevel\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}removelevel\``)
      .addField('😂 Diversión', `\`${(await prefixes.get(message.guild.id))|| PREFIX}dick\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}8ball\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}iq\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}ascii\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}rps\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}flip\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}wanted\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}gay\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}trigger\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}reverse\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}tweet\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}ttt\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}snake\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}f\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}race\``)
      .addField('👍 Otros', `\`${(await prefixes.get(message.guild.id))|| PREFIX}translate\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}say\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}math\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}poll\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}announce\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}weather\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}hastebin\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}github\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}afk\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}snipe\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}remind\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}emoji\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}wikipedia\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}transcript\``)
      .addField(':page_facing_up: Info', `\`${(await prefixes.get(message.guild.id))|| PREFIX}prefix\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}invite\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}serverinfo\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}userinfo\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}roleinfo\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}botinfo\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}avatar\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}servericon\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}botbugreport\`, \`${(await prefixes.get(message.guild.id))|| PREFIX}botsuggest\``)
      .setTimestamp();

      let database = db.get(`cmd_${message.guild.id}`)

      if(database && database.length) {
        let array =[]
        database.forEach(m => {
          array.push("`" + m.name + "`")
        })

        helpEmbed.addField(":scroll: Comandos Personalizados", array.join(", "))
      }

    return message.channel.send(helpEmbed).catch(console.error);
  }
};
