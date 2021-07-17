module.exports = {
    name: "reverse",
    description: 'Reverse command',
    usage:  '<Texto>',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args) {
        const text = args.join();
        if(!text) return message.channel.send("Escribe un texto.")
        if(text.length < 1) return message.channel.send("No puedo dar vuelta una letra...")
        const converted = text.split('').reverse().join('');
        message.channel.send(`${converted}`);
    },
};