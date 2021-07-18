const ms = require("ms");

module.exports = {
    name: 'gdelete',
    description: 'Delete giveaway command',
    usage: '<ID del sorteo>',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args) {
        if (!message.member.hasPermission("MANAGE_GUILD") && !message.member.roles.cache.some((r) => r.name.toLowerCase() === "Giveaways")) return message.channel.send("❌ No tienes permisos para usar este comando!");
        let id = args[0];
        if (!id) return message.channel.send("❌ Por favor escribe el ID del sorteo!");
        let hasGiveaway = client.giveawaysManager.giveaways.find((g) => g.messageID === id);
        if (!hasGiveaway) {
            return message.channel('No se encontro ningun sorteo con el ID: `' + id + '`');
        }
        client.giveawaysManager.delete(hasGiveaway.messageID)
        .then(() => {
            message.channel.send("El sorteo se borro correctemente.")
            if (message.deletable) message.delete();
            return;
        })
        .catch((e) => {
            message.channel.send("No hay ningun sorteo con el ID: `"+id+"`!");
        });
    }
}