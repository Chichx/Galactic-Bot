const db = require("quick.db");
const Keyv = require("keyv");
const prefixes = new Keyv("sqlite://db.sqlite");
const { PREFIX } = require("../../config.json");
const { getAuditChannel } = require("../../util/functions");

module.exports = {
  name: "removecommand",
  description: 'Removecommand command',
  usage: '<Comando>',
  cooldown: 5,
  guildOnly: true,
  async execute(client, message, args) {
    if (!message.member.hasPermission("MANAGE_MESSAGES"))
      return message.channel.send(
        ":x: Tu no tienes permisos para usar este comando."
      );
    const cmdName = args[0];

    if (!cmdName)
    return message.channel.send(`Tienes que poner el nombre del comando.\nFormato: \`${(await prefixes.get(message.guild.id)) || PREFIX}removecommand {comando}\``)

    const cmds = db.get(`cmd_${message.guild.id}`);

    if (cmds) {
      const data = cmds.find((cmd) => cmd.name === cmdName.toLowerCase());

      if (!data)
        return message.channel.send(":x: No se encontro ese comando.");

      const value = cmds.indexOf(data);
      delete cmds[value];

      const filter = cmds.filter((cmd) => {
        return cmd !== null && cmd !== "";
      });

      db.set(`cmd_${message.guild.id}`, filter);
      return message.channel.send(`Se elimino el comando **${cmdName}**.`);
    } else {
      return message.channel.send(
        ":x: No se encontro el comando."
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
          .setTitle("Comando borrado!")
          .setDescription(`Usuario: ${message.author}\nComando: **${cmdName.toLowerCase()}**`)
          .setColor("RED")
              .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
              .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
          .setTimestamp();
    
        client.channels.cache.get(auditChannel.id).send({ embed });      
    }
  },
};