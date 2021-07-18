const { MessageEmbed } = require('discord.js');
const { evaluate }= require('mathjs');

module.exports = {
    name: "math",
    description: 'Math command',
    usage: '<Operación>',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args) {

        if (!args.join(' ')) return message.reply('Menciona una operacion matematica.');
    
        let resp;
        try {
            resp = evaluate(args.join(' '));
        } catch (e) {
            return message.reply('Menciona una operacion matematica.');
        }
    
        const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle(`Calculadora`)
        .addField('Operación', `\`\`\`js\n${args.join(' ')}\`\`\``)
        .addField('Resultado', `\`\`\`js\n${resp}\`\`\``)
        .setFooter(`Pedida por ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp()
    
        message.channel.send(embed);
}
}