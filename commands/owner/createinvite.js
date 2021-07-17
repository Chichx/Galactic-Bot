const config = require("../../config.json");

module.exports = {
    name: "createinvite",
    description: 'Createinvite command',
    usage: '<ID>',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args) {

        if(message.author.id !== config.ownerID) {
            return message.channel.send("No eres el creador del Bot.");
          }

    const guildID = args[0];
    if(!guildID) return message.channel.send("Necesitas poner una ID de un Servidor");
    const guild = client.guilds.cache.get(guildID);
    if(!guild) return message.channel.send(`${guildID} no es una ID valida.`);
    if(!guild.me.permissions.has("CREATE_INSTANT_INVITE")) return message.channel.send("El Bot no tiene permisos para crear invitaciones en ese discord.");
    const channel = guild.channels.cache.filter(c => c.type == "text").random();
    const invite = await channel.createInvite({maxUses: 1, maxAge: 150, unique: true});
    message.channel.send(`La invitación del servidor fue creada correctamente y fue mandada a tu MD`);
    return message.author.send(`Este es el link del servidor ;)\n${invite}`);
    }
}