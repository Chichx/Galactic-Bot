const Captcha = require("captchapng");
const Guild = require("../models/Guild.js");
const {MessageAttachment, MessageEmbed} = require("discord.js");

const {
       captchaLength,
       captchaWidth,
       captchaHeight,
       captchaTries,
       defaultVerificationMessage
      } = require("../config.json");

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function generateCode(length) {
    let code = "";

    for (let i = 0; i < length; ++i)
        code += characters[Math.floor(Math.random() * characters.length)];

    return code;
}

module.exports = client => {
    client.on("guildMemberAdd", async member => {
        const dbGuild = await Guild.findOne({id: member.guild.id});
        if (!dbGuild || !dbGuild.verification || !dbGuild.verification.enabled) return;

        const code = (Math.random() * 900000 + Math.pow(10, captchaLength - 1)).toFixed();

        const captcha = new Captcha(captchaWidth, captchaHeight, code);
        captcha.color(0, 0, 0, 0);
        captcha.color(80, 80, 80, 255);

        const img = captcha.getBase64();
        const buffer = Buffer.from(img, "base64");

        try {
            const attachment = new MessageAttachment(buffer, "captcha.png");
            const message = dbGuild.verification.message || defaultVerificationMessage;

     let verificationembed = new MessageEmbed()
       .setTitle("Sistema de Verificación!")
       .setDescription(`${message}\n\nTu codigo de verificación:\n**${code}**`)
       .setColor("GREEN")
       .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
       .setTimestamp();
       await member.send(verificationembed);
        } catch (err) {
            if (err.name === "No se pueden enviar mensajes a este usuario.") {
                const notificationChannel = member.guild.channels.cache.get(dbGuild.verification.channelId);
                return notificationChannel.send(`:x: ${member}, Este servidor tiene un sistema de verificación, queríamos enviarle un DM/PM con un codigo pero no podemos :tired_face:! Sal del servidor y abre tus DM/PM ¡E inténtalo de nuevo!`);
            }
        }

        const filter = msg => msg.author.id === member.id;
        let tries = captchaTries;

        while (true) {
            let message;

            try {
                const collected = await member.user.dmChannel.awaitMessages(filter, {max: 1, time: 30000, errors: ["time"]});
                message = collected.first();
            } catch (err) {
                member.send(":x: El tiempo termino.");
                member.kick("Fallo en la verificacion");

                break;
            }

            if (message.content === code) {
                const role = await member.guild.roles.fetch(dbGuild.verification.roleId);

                member.roles.add(role);
                member.send(":white_check_mark: Verificó con éxito en el servidor y se le asignó el rol.");

                break;
            } else {
                member.send(":x: Codigo invalido.");
                --tries;
            }

            if (tries == 0) {
                member.send(":x: Tus codigos de verificación fueron invalidos.");
                member.kick("Fallo en codigos de verificacion.");

                break;
            }
        }
    });
};