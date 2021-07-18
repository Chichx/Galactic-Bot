const Discord = require("discord.js")

module.exports = {
  name: "addrole",
  description: 'Addrole command',
  usage: '<@Usuario> || <@Role>',
  cooldown: 5,
  guildOnly: true,
  async execute(client, message, args) {
    let role;
    if(args[1] && isNaN(args[1])) role = message.mentions.roles.first()
    if(args[1] && !isNaN(args[1])){
        role = message.guild.roles.cache.get(args[1])
    }
    let user;
    if(args[0] && isNaN(args[0])) user = message.mentions.users.first()
    if(args[0] && !isNaN(args[0])){
        user = client.users.cache.get(args[0])

        if(!message.guild.members.cache.has(args[0])) return message.reply("Usuario no encontrado.")
    }
    if(!user) return message.reply(":x: Menciona a un usuario.")
    if(!role) return message.reply(":x: Menciona a un rol.")
  if(message.guild.members.cache.get(user.id).roles.cache.has(role.id)) return message.reply(":x: El usuario ya tiene ese rango.")
    message.guild.members.cache.get(user.id).roles.add(role.id).catch(e => message.reply(e))
    message.reply(`:white_check_mark: Al usuario ${user} se le agrego el rol ${role} correctamente.`)


}}