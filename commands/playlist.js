const { MessageEmbed } = require("discord.js");
const { play } = require("../include/play");
const { YOUTUBE_API_KEY, MAX_PLAYLIST_SIZE } = require("../config.json");
const YouTubeAPI = require("simple-youtube-api");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);
const ytsr = require('ytsr');
const { getTracks } = require('spotify-url-info');

module.exports = {
  name: "playlist",
  description: 'Playlist command',
  usage: '<YouTube Playlist URL | Spotify Playlist URL>',
  cooldown: 5,
  guildOnly: true,
  async execute(client, message, args) {
    const { PRUNING } = require("../config.json");
    const { channel } = message.member.voice;

    const serverQueue = message.client.queue.get(message.guild.id);
    if (serverQueue && channel !== message.guild.me.voice.channel)
      return message.reply(`Debes entrar al mismo canal que ${message.client.user}`).catch(console.error);

    if (!args.length)
      return message
        .reply(`Uso: ${message.client.prefix}playlist <YouTube Playlist URL | Spotify Playlist URL>`)
        .catch(console.error);
    if (!channel) return message.reply("Primero tienes que entrar a un canal de voz!").catch(console.error);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
      return message.reply("No puedo conectar al canal de voz, me faltan permisos");
    if (!permissions.has("SPEAK"))
      return message.reply("No puedo hablar por este canal, asegurate de que me diste los permisos necesarios!");

    const search = args.join(" ");
    const pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
    const spotifyPlaylistPattern = /^.*(https:\/\/open\.spotify\.com\/playlist)([^#\&\?]*).*/gi;
    const spotifyPlaylistValid = spotifyPlaylistPattern.test(args[0]);
    const url = args[0];
    const urlValid = pattern.test(args[0]);

    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: 100,
      playing: true
    };

    let song = null;
    let playlist = null;
    let videos = [];
    if (spotifyPlaylistValid) {
      try {
        var fetching = await message.channel.send('Buscando...');
        let playlistTrack = await getTracks(url)
        playlistTrack.length = MAX_PLAYLIST_SIZE ? MAX_PLAYLIST_SIZE : 150
        playlist = playlistTrack.map(track => ({
          title: track.name,
          url: track.external_urls.spotify,
          duration: track.duration_ms / 1000
        }))

        for (let i in playlistTrack) {
          let result
          try {
            if (fetching && i % 4 == 0) {
              fetching.edit(`${i} canciones cargadas.`)
            }
            const ytsrResult = await ytsr((`${playlistTrack[i].name} - ${playlistTrack[i].artists ? playlistTrack[i].artists[0].name : ''}`), { limit: 1 })
            result = ytsrResult.items[0];
          } catch (err) {
            console.log(err)
            return message.channel.send(err)
          }
          song = {
            title: result.title,
            url: result.url,
            duration: this.convert(result.duration)
          }
          videos.push(song)
        }

      } catch (err) {
        console.log(err)
        return message.channel.send(err)
      }



    } else if (urlValid) {
      try {
        playlist = await youtube.getPlaylist(url, { part: "snippet" });
        videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, { part: "snippet" });
      } catch (error) {
        console.error(error);
        return message.reply("Playlist no encontrada").catch(console.error);
      }
    } else if (scdl.isValidUrl(args[0])) {
      if (args[0].includes("/sets/")) {
        message.channel.send("Buscando playlist");
        playlist = await scdl.getSetInfo(args[0], SOUNDCLOUD_CLIENT_ID);
        videos = playlist.tracks.map((track) => ({
          title: track.title,
          url: track.permalink_url,
          duration: track.duration / 1000
        }));
      }
    } else {
      try {
        const results = await youtube.searchPlaylists(search, 1, { part: "snippet" });
        playlist = results[0];
        videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, { part: "snippet" });
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    }
    const newSongs = videos
      .filter((video) => video.title != "Private video" && video.title != "Deleted video")
      .map((video) => {
        return (song = {
          title: video.title,
          url: video.url,
          duration: video.durationSeconds
        });
      });

    serverQueue ? serverQueue.songs.push(...newSongs) : queueConstruct.songs.push(...newSongs);

    let playlistEmbed = new MessageEmbed()
      .setTitle(`${playlist.title ? playlist.title : 'Spotify Playlist'}`)
      .setURL(playlist.url)
      .setColor("RANDOM")
      .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
      .setFooter(`Bot Created by Gaston#1668`, 'https://i.imgur.com/rVaN5PZ.png')  
      .setTimestamp();


    if (!PRUNING) {
      playlistEmbed.setDescription(queueConstruct.songs.map((song, index) => `${index + 1}. ${song.title}`));
      if (playlistEmbed.description.length >= 2048)
        playlistEmbed.description =
          playlistEmbed.description.substr(0, 2007) + "\nPlaylist es muy larga...";
    }

    message.channel.send(`${message.author} Empezo la playlist`, playlistEmbed);

    if (!serverQueue) {
      message.client.queue.set(message.guild.id, queueConstruct);
      try {
        queueConstruct.connection = await channel.join();
        await queueConstruct.connection.voice.setSelfDeaf(true);
        play(queueConstruct.songs[0], message);
      } catch (error) {
        console.error(error);
        message.client.queue.delete(message.guild.id);
        await channel.leave();
        return message.channel.send(i18n.__("play.cantJoinChannel", { error: error })).catch(console.error);
      }
    }
  },
  convert(second) {
    const a = second.split(':');
    let rre
    if (a.length == 2) {
      rre = (a[0] * 60) + a[1]
    } else {
      rre = ((a[0] * 60) * 60) + (a[1] * 60) + a[2]
    }

    return rre;
  }
};
