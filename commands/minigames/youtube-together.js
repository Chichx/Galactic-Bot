const { Client } = require("discord.js");
const fetch = require("node-fetch");
const client = new Client();

const ACTIVITIES = {
    "poker": {
        id: "755827207812677713",
        name: "Poker Night"
    },
    "betrayal": {
        id: "773336526917861400",
        name: "Betrayal.io"
    },
    "youtube": {
        id: "755600276941176913",
        name: "YouTube Together"
    },
    "fishington": {
        id: "814288819477020702",
        name: "Fishington.io"
    }
};

module.exports = {
    name: 'youtube-together',
    description: 'Youtube command',
    usage: '<@Canal || Id Canal>',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args) {

        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        if (!channel || channel.type !== "voice") return message.channel.send("❌ | ID del canal no especificada!");
        if (!channel.permissionsFor(message.guild.me).has("CREATE_INSTANT_INVITE")) return message.channel.send("❌ | Necesito el permiso `CREATE_INSTANT_INVITE`");

        fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
            method: "POST",
            body: JSON.stringify({
                max_age: 86400,
                max_uses: 0,
                target_application_id: "755600276941176913", // youtube together
                target_type: 2,
                temporary: false,
                validate: null
            }),
            headers: {
                "Authorization": `Bot ${client.token}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(invite => {
                if (invite.error || !invite.code) return message.channel.send("❌ | No se pudo iniciar **YouTube Together**!");
                message.channel.send(`✅ | Haga clic aquí para iniciar **YouTube Together** en ${channel.name}: <https://discord.gg/${invite.code}>`);
            })
            .catch(e => {
                message.channel.send("❌ | No se pudo iniciar **YouTube Together**!");
            })
    }
}