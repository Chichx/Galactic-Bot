const { MessageEmbed } = require("discord.js");
const { getWarningUsers } = require("../../util/functions");
const Keyv = require("keyv");
const prefixes = new Keyv("sqlite://db.sqlite");
const { PREFIX } = require("../../config.json");

module.exports = {
  name: "warnings",
  description: 'Warnings command',
  usage: '<@Usuario>',
  cooldown: 5,
  guildOnly: true,
  async execute(client, message, args) {
    const guildId = message.guild.id;
    const warningNr = args[1];
    const member =
      message.guild.member(message.mentions.users.first()) ||
      message.guild.members.cache.get(args[0]);

    if (!member) {
      return message.channel.send(`Por favor especifica a un usuario.\nFormato: \`${(await prefixes.get(message.guild.id)) || PREFIX}warnings {user}\` o \`${(await prefixes.get(message.guild.id)) || PREFIX}warnings {user} {numero de advertencia}\``);
    }

    const users = (await getWarningUsers(guildId)) || [];
    const warnings = users.filter((w) => w.user.id === member.user.id);

    let embed = new MessageEmbed()
      .setColor("ORANGE")
      .setTimestamp()
    .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')

    if (warningNr) {
      const warning = warnings.filter((w, idx) => idx === warningNr - 1)[0];

      if (!warning) {
        return message.channel.send(
          `No hay ningun advertencia o ${member.user.tag} no tiene ningun advertencia.`
        );
      }

      embed
        .setTitle(`Advertencia: ${warningNr}`)
        .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
        .addField("**Razón:**", warning.reason)
      return message.channel.send({ embed });
    }

    embed
      .setTitle(`${member.user.tag}'s advertencias`)
      .addField("**Total de advertencias**", warnings.length + " Advertencias")
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setDescription(`Usa \`${(await prefixes.get(message.guild.id)) || PREFIX}warnings <usuario> <numero de advertencia>\` y veras mas información sobre la advertencia`);
    message.channel.send({ embed });
  },
};