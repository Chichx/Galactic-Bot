const discordTTS = require('discord-tts-spanish');


module.exports = {
    name: "tts",
    description: 'TTS command',
    usage: '<Texto>',
    cooldown: 5,
    guildOnly: true,
    execute(client, message, args) {

        const argsJoin = args.join(" ");
        if (!argsJoin) return message.reply("Tienes que escribir algo para que el bot lo repita.").catch(console.error);
        const queue = message.client.queue.get(message.guild.id);

        if (queue) {
            message.delete();
            return message.reply("No se puede reproducir ya que la queue esta activa.").then(msg => { msg.delete( {timeout: 3000 }) })

        } else {
            
            const broadcast = client.voice.createBroadcast();
            var channelId = message.member.voice.channelID;
    if (!channelId) return message.reply("Primero tienes que entrar a un canal de voz!").catch(console.error);
            var channel = client.channels.cache.get(channelId);

            channel.join().then(connection => {
                broadcast.play(discordTTS.getVoiceStream(argsJoin));
                const dispacher = connection.play(broadcast);

            });
            }
        }
        };