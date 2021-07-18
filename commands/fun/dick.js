const { MessageEmbed } = require("discord.js");
const Keyv = require("keyv");
const prefixes = new Keyv("sqlite://db.sqlite");
const { PREFIX } = require("../../config.json");

module.exports = {
	name: 'dick',
    description: 'Dick command',
    usage: '<@Usuario>',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args) 
    {     
    let pija = [
    "No tiene pija.",  
    "8=D",
    "8==D",
    "8===D",
    "8====D",
    "8=====D",
    "8======D",
    "8=======D",
    "8========D",
    "8===========D",
    ]
    let user = message.mentions.users.first()
    if(!user) return message.reply(`Por favor especifica a un usuario.\nFormato: \`${(await prefixes.get(message.guild.id)) || PREFIX}dick <User>\``).catch(console.error);
    let pijon = pija[Math.floor(Math.random() * pija.length)];
    let embedpija = new MessageEmbed()
         .setAuthor(`Tamaño`)
         .setDescription(`${user.username}'s penis\n${pijon}`)
         .setColor("RANDOM")
         .setTimestamp()
         .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
         .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
         message.channel.send(embedpija)
        }}