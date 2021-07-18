const {MessageAttachment} = require("discord.js");
const Swiftcord = require("swiftcord");
const canva = new Swiftcord.Canvas();

module.exports = {
    name: "wanted",
    description: 'Wanted command',
    usage: '<@Usuario>',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args) {
        let msg = await message.channel.send("Espera...");
        let avatar = message.mentions.users.size ? message.mentions.users.first().avatarURL({dynamic: false, format: 
            'png'}) : message.author.avatarURL({  dynamic: false, format: 'png'});
        let image = await canva.wanted(avatar);
        let attach = new MessageAttachment(image, "wanted.png");
        message.channel.send(attach);
        msg.delete();
    },
};