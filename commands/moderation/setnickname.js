const Discord = require("discord.js");

module.exports = {
    name: 'setnickname',
    description: 'Setnickname command',
    usage: '<@Usuario> || <Nickname>',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args) {
  
  // You can make a single array to detect the user permissions.
  if (!message.member.hasPermission("ADMINISTRATOR")) {
    return message.channel.send(":x: No tienes permisos para usar este comando.");
  }
  
  let user = message.mentions.users.first(); // You can mention someone, not only just user.
  if (!user) return message.channel.send("Tienes que mencionar a un usuario!");
  
  let nick = args.slice(1).join(" ");
  if (!nick) return message.channel.send("Tienes que poner un apodo al usuario!");
  
  let member = message.guild.members.cache.get(user.id);
  
  await member.setNickname(nick).catch(err => message.channel.send(`Error: ${err}`));
  return message.channel.send(`Se cambio correctamente el apodo de **${user.tag}** al nuevo apodo **${nick}**`);
}}