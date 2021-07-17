const { MessageEmbed } = require('discord.js')
const { DiscordTogether } = require('discord-together');
module.exports = {
    name: 'chess',
    description: 'Chess command',
    usage: '<@Canal || Id Canal>',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args) {

        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        if (!channel || channel.type !== "voice") return message.channel.send("❌ | ID del canal no especificada!");
        if (!channel.permissionsFor(message.guild.me).has("CREATE_INSTANT_INVITE")) return message.channel.send("❌ | Necesito el permiso `CREATE_INSTANT_INVITE`");

        client.discordTogether = new DiscordTogether(client);
        if(message.member.voice.channel) {
            client.discordTogether.createTogetherCode(message.member.voice.channelID, 'chess').then(async invite => {
                return message.channel.send(`✅ | Haga clic aquí para iniciar **Chess** en ${channel.name}: ${invite.code}`);
            });
        }
    }
}