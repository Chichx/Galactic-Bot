const {MessageAttachment} = require("discord.js");
const Swiftcord = require("swiftcord");
const canva = new Swiftcord.Canvas();

module.exports = {
    name: "trigger",
    description: 'Trigger command',
    usage: '<@Usuario>',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args) {
        let msg = await message.channel.send("Espera...");
        let avatar = message.mentions.users.size ? message.mentions.users.first().avatarURL({dynamic: false, format: 
            'png'}) : message.author.avatarURL({  dynamic: false, format: 'png'});
        let image = await canva.trigger(avatar);
        let attachment = new MessageAttachment(image, "triggered.gif");
       message.channel.send(attachment);
       msg.delete();
    },
};