const ytdlDiscord = require("ytdl-core-discord");
const ytdl = require("erit-ytdl");
const scdl = require("soundcloud-downloader").default;
const { MessageEmbed } = require("discord.js");
const { canModifyQueue } = require("../util/GastonbotUtil");
// //AIzaSyCHY9cj23_pyVjgZ30v6LodKUpWK0C4fUY AIzaSyBsLeqO_nwmdFC5njEMPOzMVWGPl9w56J8 AIzaSyA3ZDj_c_r73JHpMN5haqNdBE4QhUPdZiY AIzaSyCtg1IKLvJofEkUfkQjlo2kj5MXUdlyXSQ
module.exports = {
  async play(song, message) {
    const { PRUNING, SOUNDCLOUD_CLIENT_ID } = require("../config.json");
    const queue = message.client.queue.get(message.guild.id);

    if (!song) {
      queue.channel.leave();
      message.client.queue.delete(message.guild.id);
    let added3Embed = new MessageEmbed()
      .setTitle(`Termino la Queue!`)
      .setDescription(`🚫 La queue fue terminada.`)
      .setColor("RED")
      .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')  
      .setTimestamp()
      return queue.textChannel.send(added3Embed).catch(console.error);
    }

    let stream = null;
    let streamType = song.url.includes("youtube.com") ? "opus" : "ogg/opus";

    try {
      if (song.url.includes("youtube.com")) {
        stream = await ytdl(song.url, { highWaterMark: 1 << 25 });
      } else if (song.url.includes("soundcloud.com")) {
        try {
          stream = await scdl.downloadFormat(
            song.url,
            scdl.FORMATS.OPUS,
            SOUNDCLOUD_CLIENT_ID ? SOUNDCLOUD_CLIENT_ID : undefined
          );
        } catch (error) {
          stream = await scdl.downloadFormat(
            song.url,
            scdl.FORMATS.MP3,
            SOUNDCLOUD_CLIENT_ID ? SOUNDCLOUD_CLIENT_ID : undefined
          );
          streamType = "unknown";
        }
      }
    } catch (error) {
      if (queue) {
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      }

      console.error(error);
      return message.channel.send(`Error: ${error.message ? error.message : error}`);
    }

    queue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));

    const dispatcher = queue.connection
      .play(stream, { type: streamType })
      .on("finish", () => {
        if (collector && !collector.ended) collector.stop();

        if (queue.loop) {
          let lastSong = queue.songs.shift();
          queue.songs.push(lastSong);
          module.exports.play(queue.songs[0], message);
        } else {
          queue.songs.shift();
          module.exports.play(queue.songs[0], message);
        }
      })
      .on("error", (err) => {
        console.error(err);
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      });
    dispatcher.setVolumeLogarithmic(queue.volume / 100);

    try {
    let adEmbed = new MessageEmbed()
      .setAuthor(`Musica lista para Reproducir!`)
      .setTitle(`**${song.title}**`)
      .setURL(`${song.url}`)
      .setColor("GREEN")
      .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')  
      .setTimestamp()    
      var playingMessage = await queue.textChannel.send(adEmbed);
      await playingMessage.react("➡️");
      await playingMessage.react("⏸️");
      await playingMessage.react("▶");
      await playingMessage.react("🔉");
      await playingMessage.react("🔊");      
      await playingMessage.react("🔁");
      await playingMessage.react("🛑");  
    } catch (error) {
      console.error(error);
    }

    const filter = (reaction, user) => user.id !== message.client.user.id;
    var collector = playingMessage.createReactionCollector(filter, {
      time: song.duration > 0 ? song.duration * 1000 : 600000
    });

    collector.on("collect", (reaction, user) => {
      if (!queue) return;
      const member = message.guild.member(user);

      switch (reaction.emoji.name) {
        case "➡️":
          queue.playing = true;
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.connection.dispatcher.end();
              let skipEmbed = new MessageEmbed()
      .setTitle(`Musica Omitida!`)
      .setDescription(`${user} ⏭ omitió la canción`)
      .setColor("GREEN")
      .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')  
      .setTimestamp()    
          queue.textChannel.send(skipEmbed).catch(console.error);
          collector.stop();
          break;

        case "⏸️":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          if (queue.playing) 
            queue.playing = !queue.playing;
            queue.connection.dispatcher.pause(true);
    let pauseEmbed = new MessageEmbed()
      .setTitle(`Musica Pausada!`)
      .setDescription(`${user} ⏸ pausó la musica`)
      .setColor("GREEN")
      .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')  
      .setTimestamp()                  
            queue.textChannel.send(pauseEmbed).catch(console.error); 
        break;  

        case "▶":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          if (queue.playing) 
            queue.playing = !queue.playing;
            queue.connection.dispatcher.resume();
    let renewEmbed = new MessageEmbed()
      .setTitle(`Musica Reanudada!`)
      .setDescription(`${user} ▶ reanudó la musica!`)
      .setColor("GREEN")
      .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')  
      .setTimestamp()                  
            queue.textChannel.send(renewEmbed).catch(console.error);
        break;        
        


        case "🔉":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          if (queue.volume - 10 <= 0) queue.volume = 0;
          else queue.volume = queue.volume - 10;
          queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
          let bajoEmbed = new MessageEmbed()
          .setTitle(`Volumen bajado!`)
          .setDescription(`${user} 🔉 bajo el volumen de la musica a ${queue.volume}%`)
          .setColor("GREEN")
          .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
          .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')  
          .setTimestamp()                  
          queue.textChannel.send(bajoEmbed).catch(console.error);
          break;

        case "🔊":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          if (queue.volume + 10 >= 100) queue.volume = 100;
          else queue.volume = queue.volume + 10;
          queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
          let SBIEmbed = new MessageEmbed()
          .setTitle(`Volumen subido!`)
          .setDescription(`${user} 🔊 subió el volumen de la musica a ${queue.volume}%`)
          .setColor("GREEN")
          .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
          .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')  
          .setTimestamp()                  
          queue.textChannel.send(SBIEmbed).catch(console.error);
          break;        

        case "🔁":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.loop = !queue.loop;
              let loopEmbed = new MessageEmbed()
      .setTitle(`Reproducir nuevamente!`)
      .setDescription(`Loop ahora está ${queue.loop ? "**Activado**" : "**Desactivado**"}`)
      .setColor("GREEN")
      .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')  
      .setTimestamp()    
          queue.textChannel.send(loopEmbed).catch(console.error);
          break;

        case "🛑":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.songs = [];
    let stopEmbed = new MessageEmbed()
      .setTitle(`Musica Parada!`)
      .setDescription(`${user} 🛑 paró la musica!`)
      .setColor("RED")
      .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')  
      .setTimestamp()        
          queue.textChannel.send(stopEmbed).catch(console.error);
          try {
            queue.connection.dispatcher.end();
          } catch (error) {
            console.error(error);
            queue.connection.disconnect();
          }
          collector.stop();
          break;

        default:
          reaction.users.remove(user).catch(console.error);
          break;
      }
    });

    collector.on("end", () => {
      playingMessage.reactions.removeAll().catch(console.error);
      if (PRUNING && playingMessage && !playingMessage.deleted) {
        playingMessage.delete({ timeout: 3000 }).catch(console.error);
      }
    });
  }
};
