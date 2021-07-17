const ms = require('ms');
const Keyv = require("keyv");
const prefixes = new Keyv("sqlite://db.sqlite");
const { PREFIX } = require("../../config.json");

module.exports = {
    name: 'slowmode',
    description: 'Slowmode command',
    usage: '<Tiempo>',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args) {

	if (!message.member.hasPermission('MANAGE_CHANNELS')) {
		message.channel.send({ embed:{ color:15158332, description:`No tienes el permiso \`MANAGE_CHANNELS\` para usar este comando.` } }).then(m => m.delete({ timeout: 10000 }));
		return;
	}

  let channel = message.mentions.channels.first(),
      time = args.slice(1).join(" ");
  
  if (!channel) time = args.join(" "), channel = message.channel;
  // If the user doesn't includes the channel.
  
  if (message.flags[0] === "off") {
    channel.setRateLimitPerUser(0);
    return message.channel.send(`<#${channel.id}> El slowmode fue desactivado.`);
  }
  
  if (!time) return message.channel.send("Por favor escribe un tiempo.");
  
  let convert = ms(time); // This will results the milliseconds.
  let toSecond = Math.floor(convert / 1000); // This will convert the ms to s. (seconds)
  
  if (!toSecond || toSecond == undefined) return message.channel.send("Por favor escribe un tiempo.");
  
  if (toSecond > 21600) return message.channel.send("El tiempo no puede pasar mas de 6 horas.");
  else if (toSecond < 1) return message.channel.send("El tiempo no puede ser menos de 1 segundo.");
  
  await channel.setRateLimitPerUser(toSecond);
  return message.channel.send(`El canal <#${channel.id}> fue puesto en slowmode por **${ms(ms(time), {long: true})}**.`);
}}