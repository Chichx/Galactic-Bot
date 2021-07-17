const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const Keyv = require("keyv");
const prefixes = new Keyv("sqlite://db.sqlite");
const { PREFIX } = require("../../config.json");
const { getAuditChannel } = require("../../util/functions");


module.exports = {
  name: "addcommand",
  description: 'Addcommand command',
  usage: '<Comando> <Respuesta>',
  cooldown: 5,
  guildOnly: true,
  async execute(client, message, args, channel, guild) {
    if (!message.member.hasPermission("MANAGE_MESSAGES"))
      return message.channel.send(
        ":x: Tu no tienes permisos para usar este comando."
      );

    const cmdName = args[0];

    if (!cmdName)
      return message.channel.send(`Tienes que poner el nombre del comando.\nFormato: \`${(await prefixes.get(message.guild.id)) || PREFIX}addcommand {comando} [respuesta]\``)

    const cmdResponse = args.slice(1).join(' ');

    if (!cmdResponse)
      return message.channel.send(
        `:x: Tienes que poner la respuesta del comando.\nFormato: \`${(await prefixes.get(message.guild.id)) || PREFIX}addcommand {comando} [respuesta]\``
      );

    const database = db.get(`cmd_${message.guild.id}`);

    if (database && database.find((x) => x.name === cmdName.toLowerCase()))
      return message.channel.send(
        ":x: Este comando ya esta agregado en el servidor."
      );

    if (client.commands.has(cmdName)) {
      return message.channel.send(
        ":x: El comando ya esta siendo usando por el bot."
      );
    }

    const data = {
      name: cmdName.toLowerCase(),
      response: cmdResponse,
    };

    db.push(`cmd_${message.guild.id}`, data);

    message.channel.send(
      "Se agrego el comando **" + cmdName.toLowerCase() + "**."
    );
    const auditChannel = await getAuditChannel(message.channel.guild.id);

        // not enabled
        if (auditChannel === null || !auditChannel) return;

        // channel not found/deleted
        if (
          !message.channel.guild.channels.cache.some((ch) => ch.name === auditChannel.name)
        )
          return;

          const embed = new MessageEmbed()
          .setTitle("Comando agregado!")
          .setDescription(`Usuario: ${message.author}\nComando: **${cmdName.toLowerCase()}**`)
          .setColor("GREEN")
              .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
              .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
          .setTimestamp();
    
        client.channels.cache.get(auditChannel.id).send({ embed });          
  },
};
