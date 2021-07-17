const {MessageEmbed, DiscordAPIError} = require("discord.js");
const Guild = require("../../models/Guild.js");

module.exports = {
    name: "setup",
    description: 'Setup command',
    usage: '',
    cooldown: 5,
    guildOnly: true,

    async execute(client, message, args) {

    if (!message.member.hasPermission("MANAGE_ROLES")) {
      return message.channel.send(
        ":x: Tu no tienes permisos para usar este comando."
      );
    }

        if (!args.length || typeof args[0] !== "string") {
            const dbGuild = await Guild.findOne({id: message.guild.id});
            const isEnabled = dbGuild && dbGuild.verification ? dbGuild.verification.enabled : false;

            const embed = new MessageEmbed()
                .setTitle("Setup")
                .setColor("RANDOM")
                .setFooter(`Verificación ${isEnabled ? "Activada" : "Desactivada"}.`)
                .setTimestamp()
                .addFields(
                    {
                        name: "`setup enable`",
                        value: "Activar la verificación"
                    },

                    {
                        name: "`setup message <mensaje>`",
                        value: "Poner un mensaje de verificación."
                    },

                    {
                        name: "`setup role <rol>`",
                        value: "Poner el rol de verificación.",
                    },

                    {
                        name: "`setup notification-channel <canal>`",
                        value: "Poner que de una notificación cuando un usuario tenga los DM Cerrados"
                    },

                    {
                        name: "`setup disable`",
                        value: "Desactivar la verificación",
                    }
                );

            return message.channel.send(embed);
        }

        const option = args[0].toLowerCase();

        switch (option) {
            case "message": {
                // TODO: Check if the guild has premium

                const text = args.slice(1).join(" ");

                if (!text)
                    return message.channel.send("<a:x_:859959819070472192> Tienes que poner un mensaje");

                await Guild.findOneAndUpdate({id: message.guild.id}, {$set: {"verification.message": text}}, {upsert: true});
                return message.channel.send("<a:check:859215524122329088> Mensaje de verificación agregado.");
            }

            case "role": {
                const mentionedRole = message.mentions.roles.first();
                const roleId = mentionedRole ? mentionedRole.id : args[1];

                if (!message.guild.roles.cache.has(roleId))
                    return message.channel.send(":x: Rol no encontrado.");

                await Guild.findOneAndUpdate({id: message.guild.id}, {$set: {"verification.roleId": roleId}}, {upsert: true});
                return message.channel.send("<a:check:859215524122329088> Rol de verificación agregado.");
            }

            case "notification-channel": {
                const channel = message.mentions.channels.first();

                if (!channel)
                    return message.channel.send("<a:x_:859959819070472192> Canal no encontrado");

                await Guild.findOneAndUpdate({id: message.guild.id}, {$set: {"verification.channelId": channel.id}}, {upsert: true});
                return message.channel.send("<a:check:859215524122329088> Canal de verificación agregado.");
            }

            case "enable": {
                const dbGuild = await Guild.findOneOrCreate({id: message.guild.id});

                if (!dbGuild.verification.message)
                    return message.channel.send("<a:x_:859959819070472192> Necesitas poner un mensaje.");

                if (!dbGuild.verification.roleId)
                    return message.channel.send("<a:x_:859959819070472192> Necesitas poner un rol.");

                if (!dbGuild.verification.channelId)
                    return message.channel.send("<a:x_:859959819070472192> Neceitas poner el canal de notificación.");

                dbGuild.verification.enabled = true;
                dbGuild.save();

                return message.channel.send("<a:check:859215524122329088> Verificación activada");
            }

            case "disable": {
                await Guild.findOneAndUpdate({id: message.guild.id}, {$set: {"verification.enabled": false}}, {upsert: true});
                return message.channel.send("<a:check:859215524122329088> Verificación desactivada.");
            }

            default: {
                return message.channel.send("<a:x_:859959819070472192> Opción no valida.");
            }
        }
    }
};