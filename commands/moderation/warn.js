const {
  getWarningUsers,
  setWarningUsers,
  addWarningUser,
} = require("../../util/functions");
const Discord = require("discord.js");
const Keyv = require("keyv");
const prefixes = new Keyv("sqlite://db.sqlite");
const { PREFIX } = require("../../config.json");
const { getAuditChannel } = require("../../util/functions");

module.exports = {
  name: "warn",
  description: 'Warn command',
  usage: '<@Usuario> || <Razón>',
  cooldown: 5,
  guildOnly: true,
  async execute(client, message, args) {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) {  
      const notUse = new Discord.MessageEmbed()
          .setColor("#E74C3C")
          .setDescription(`:x: **Tu no tienes permiso para usar el comando __WARN__**`)
          .setTimestamp()
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
          .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
      return message.channel.send(notUse);
    } 

    const guildId = message.guild.id;
    const reason = args.slice(1).join(" ");
    const member =
      message.guild.member(message.mentions.users.first()) ||
      message.guild.members.cache.get(args[0]);

    if (!member) {
      return message.channel.send(`Por favor especifica a un usuario.\nFormato: \`${(await prefixes.get(message.guild.id)) || PREFIX}warn {user} [razón]\``);
    }

    if (member.hasPermission("MANAGE_MESSAGES")) {
      return message.channel.send("El usuario que mencionaste no puedes darle una advertencia.");
    }

    const data = {
      user: member.user,
      reason: reason,
    };
    let existingWarnings = await getWarningUsers(guildId);

    if (existingWarnings === null) {
      setWarningUsers(guildId, [data]);
    }

    const warnings = await getWarningUsers(guildId);
    const userWarnings = warnings.filter((w) => w.user.id === member.user.id);

    addWarningUser(guildId, data);

                    const auditChannel = await getAuditChannel(message.channel.guild.id);

                    // not enabled
                    if (auditChannel === null || !auditChannel) return;
            
                    // channel not found/deleted
                    if (
                      !message.channel.guild.channels.cache.some((ch) => ch.name === auditChannel.name)
                    )
                      return;
            
                      const embed = new Discord.MessageEmbed()
                      .setTitle("Warn Logs!")
                      .setDescription(`Usuario: ${member.user}\nMuteado por: ${message.author}\nRazón: \`${reason}\`\nTotal: \`${userWarnings ? userWarnings.length + 1 : "0"}\``)
                      .setColor("YELLOW")
.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
                      .setTimestamp();
                
                    client.channels.cache.get(auditChannel.id).send({ embed });     

    const warnsu = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setDescription(`:white_check_mark: El usuario fue advertido correctamente.\n\n**Usuario:** ${member.user}\n**Razón:** ${reason}\n**Advertido por:** ${message.author}\n**Total:** ${
      userWarnings ? userWarnings.length + 1 : "0"
    }`)
    .setTimestamp()
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
    .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
return message.channel.send(warnsu);
  },
};