const figlet = require("figlet");

module.exports = {
    name: "ascii",
    description: 'Asicii command',
    usage: '<Texto>',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args) {
        if(!args[0]) return message.channel.send('Por favor escribe un texto.');
        const text = args.join(" ");

        figlet.text(text, (e, txt) => {
            if (e) return console.log(e);
            message.channel.send(`\`\`\` ${txt.trimRight()} \`\`\``);
        });
    }
};