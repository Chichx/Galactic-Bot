const ms = require('ms');

module.exports = {
    name: 'greroll',
    description: 'Reroll giveaway command',
    usage: '<ID del Sorteo>',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args) {
    // If the member doesn't have enough permissions
    if(!message.member.hasPermission('MANAGE_MESSAGES') && !message.member.roles.cache.some((r) => r.name.toLowerCase() === "Giveaways")){
        return message.channel.send(':x: Tu no tienes permisos para usar este comando.');
    }

    // If no message ID or giveaway name is specified
    if(!args[0]){
        return message.channel.send(':x: Por favor especifica la ID del mensaje!');
    }

    // try to found the giveaway with prize then with ID
    let giveaway = 
    // Search with giveaway prize
    client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) ||
    // Search with giveaway ID
    client.giveawaysManager.giveaways.find((g) => g.messageID === args[0]);

    // If no giveaway was found
    if(!giveaway){
        return message.channel.send('No se puede encontrar este sorteo `'+ args.join(' ') +'`.');
    }

    // Reroll the giveaway
    client.giveawaysManager.reroll(giveaway.messageID)
    .then(() => {
        // Success message
        message.channel.send('Sorteo resorteado!');
    })
    .catch((e) => {
        if(e.startsWith(`El sorteo con este ID ${giveaway.messageID} no ha terminado.`)){
            message.channel.send('El sorteo todavia no ha terminado!');
        } else {
            console.error(e);
            message.channel.send('Ocurrio un error...');
        }
    });

}}