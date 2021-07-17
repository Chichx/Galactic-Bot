const Discord = require("discord.js");
const Keyv = require("keyv");
const prefixes = new Keyv("sqlite://db.sqlite");
const { PREFIX } = require("../../config.json");

module.exports = {
    name: 'poll',
    description: 'Poll command',
    usage: '',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args) {
    message.delete();
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Tu no tienes permisos para usar este comando.").then(msg => msg.delete({ timeout: 10000 }));

    let options = args.join(' ').split('|').map(s => s.trim().replace(/\s\s+/g, ' '))
    let question = options.shift(),
    emoji = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯']


    if (!args[0]) return message.channel.send(`Por favor haz una pregunta. \`${(await prefixes.get(message.guild.id)) || PREFIX}poll Pregunta | Opción1 | Opción2|\`\nEl mínimo de opciones son 2 y el máximo 10\nPara separar una opción de la otra es con **|**`);
    if (!args[1]) return message.channel.send(`Por favor haz opciones. \`${(await prefixes.get(message.guild.id)) || PREFIX}poll Pregunta | Opción1 | Opción2\`\nEl mínimo de opciones son 2 y el máximo 10\nPara separar una opción de la otra es con **|**`);
    await message.delete;

    const embed = new Discord.MessageEmbed()
    .setTitle("La encuesta comenzó!")
    .setColor('BLURPLE')
    .setTimestamp()
    .addField(question, `${emoji[0]} ${options[0]}`)
    .setFooter(`Encuesta comenzada por: ${message.author.username}`, `${message.author.avatarURL()}`)

    for (let i = 1; i < options.length && i < 10; i++) embed.addField('\u200b', `${emoji[i]} ${options[i]}`)

    let msg = await message.channel.send(embed)

    for (let i in options) await msg.react(emoji[i])
}};
