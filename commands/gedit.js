const Discord = require('discord.js');
const ms = require("ms");
const num = require("num-parse");

module.exports = {
    name: 'gedit',
    description: 'Edit giveaway command',
    usage: '',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args) {
        if (!message.member.hasPermission("MANAGE_GUILD") && !message.member.roles.cache.some((r) => r.name.toLowerCase() === "Giveaways")) return message.channel.send("❌ No tienes permisos para usar este comando!");
        let id = args[0];
        if (!id) return message.channel.send("❌ Por favor escribe el ID del sorteo!");
        let hasGiveaway = client.giveawaysManager.giveaways.find((g) => g.messageID === id);
        if (!hasGiveaway) {
            return message.channel.send('No se encontro ningun sorteo con el ID:`' + id + '`');
        }
        let time = args[1];
        if (!time) return message.channel.send("❌ Escribe la duración del sorteo!");
        if (ms(time) > ms("15d")) {
            return message.channel.send("❌ El sorteo no puede durar mas de 15d");
        }
        let winners = args[2];
        if (!winners) return message.channel.send("❌ Escribe el numero de ganadores!");
        num(winners, 1);
        if (winners > 20) return message.channel.send("❌ En el sorteo no no puede pasar los 20 ganadores");
        let prize = args.slice(3).join(" ");
        if (!prize) return message.channel.send("❌ Escribe el nuevo premio!");

        client.giveawaysManager.edit(hasGiveaway.messageID, {
            addTime: ms(time),
            newWinnerCount: parseInt(winners),
            newPrize: prize,
        })
        .then(() => {
            message.channel.send("Sorteo editado!")
            if (message.deletable) message.delete();
            return;
        }).catch((err) => {
            message.channel.send("No hay ningun sorteo con el ID: " + id + "!");
        });
    }
}