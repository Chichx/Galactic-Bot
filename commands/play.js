const { play } = require("../include/play");
const { YOUTUBE_API_KEY, SOUNDCLOUD_CLIENT_ID, SPOTIFY_CLIENT_ID, SPOTIFY_SECRET_ID } = require("../config.json");
const ytdl = require("ytdl-core");
const scdl = require("soundcloud-downloader").default;
const { MessageEmbed } = require("discord.js");
const https = require("https");
const YouTubeAPI = require("simple-youtube-api");
const spotifyURI = require('spotify-uri');
const Spotify = require('node-spotify-api');

const youtube = new YouTubeAPI(YOUTUBE_API_KEY);
const spotify = new Spotify({
  id: SPOTIFY_CLIENT_ID,
  secret: SPOTIFY_SECRET_ID
});


module.exports = {
  name: "play",
  description: 'Play command',
  usage: '<YouTube URL | Video Name | Spotify URL>',
  cooldown: 5,
  guildOnly: true,
  async execute(client, message, args) {
  const { channel } = message.member.voice;

    const serverQueue = message.client.queue.get(message.guild.id);
    if (!channel) return message.reply("Primero tienes que entrar a un canal de voz!").catch(console.error);
    if (serverQueue && channel !== message.guild.me.voice.channel)
      return message.reply(`Debes entrar al mismo canal que ${message.client.user}`).catch(console.error);

    if (!args.length)
      return message
        .reply(`Uso: ${message.client.prefix}play <YouTube URL | Video Name | Spotify URL>`)
        .catch(console.error);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
      return message.reply("No puedo conectar al canal de voz, me faltan permisos");
    if (!permissions.has("SPEAK"))
      return message.reply("No puedo hablar por este canal, asegurate de que me diste los permisos necesarios!");


    const search = args.join(" ");
    const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
    const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
    const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
    const mobileScRegex = /^https?:\/\/(soundcloud\.app\.goo\.gl)\/(.*)$/;
    const spotifyPattern = /^.*(https:\/\/open\.spotify\.com\/track)([^#\&\?]*).*/gi;
    const spotifyValid = spotifyPattern.test(args[0]);
    const spotifyPlaylistPattern = /^.*(https:\/\/open\.spotify\.com\/playlist)([^#\&\?]*).*/gi;
    const spotifyPlaylistValid = spotifyPlaylistPattern.test(args[0])
    const url = args[0];
    const urlValid = videoPattern.test(args[0]);

    // Start the playlist if playlist url was provided
    if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
      return message.client.commands.get("playlist").execute(message, args);
    } else if (scdl.isValidUrl(url) && url.includes("/sets/")) {
      return message.client.commands.get("playlist").execute(message, args);
    } else if (spotifyPlaylistValid) {
      return message.client.commands.get("playlist").execute(message, args);
    }

    if (mobileScRegex.test(url)) {
      try {
        https.get(url, function (res) {
          if (res.statusCode == "302") {
            return message.client.commands.get("play").execute(message, [res.headers.location]);
          } else {
            return message.reply("No se encontro la url.").catch(console.error);
          }
        });
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
      return message.reply("Redireccionando a la url...").catch(console.error);
    }

    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: 100,
      playing: true
    };

    let songInfo = null;
    let song = null;

    if (spotifyValid) {
      let spotifyTitle, spotifyArtist;
      const spotifyTrackID = spotifyURI.parse(url).id
      const spotifyInfo = await spotify.request(`https://api.spotify.com/v1/tracks/${spotifyTrackID}`).catch(err => {
        return message.channel.send(`Algo salió mal... \n` + err)
      })
      spotifyTitle = spotifyInfo.name
      spotifyArtist = spotifyInfo.artists[0].name

      try {
        const final = await youtube.searchVideos(`${spotifyTitle} - ${spotifyArtist}`, 1, { part: 'snippet' });
        songInfo = await ytdl.getInfo(final[0].url)
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds
        }
      } catch (err) {
        console.log(err)
        return message.channel.send(`Oops.. There was an error! \n ` + err)
      }

    } else if (urlValid) {
      try {
        songInfo = await ytdl.getInfo(url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds
        };
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    } else if (scRegex.test(url)) {
      try {
        const trackInfo = await scdl.getInfo(url, SOUNDCLOUD_CLIENT_ID);
        song = {
          title: trackInfo.title,
          url: trackInfo.permalink_url,
          duration: Math.ceil(trackInfo.duration / 1000)
        };
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    } else {
      try {
        const results = await youtube.searchVideos(search, 1, { part: "snippet" });
        songInfo = await ytdl.getInfo(results[0].url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds
        };
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    }

    if (serverQueue) {
      serverQueue.songs.push(song);
    let added2Embed = new MessageEmbed()
      .setTitle(`Agregada Queue!`)
      .setDescription(`✅ **${song.title}** fue agregada a la queue por el usuario ${message.author}`)
      .setColor("GREEN")
      .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')  
      .setTimestamp()
      return serverQueue.textChannel.send(added2Embed).catch(console.error);
    }

    queueConstruct.songs.push(song);
    message.client.queue.set(message.guild.id, queueConstruct);
    try {
      queueConstruct.connection = await channel.join();
      await queueConstruct.connection.voice.setSelfDeaf(true);
      play(queueConstruct.songs[0], message);
    } catch (error) {

      console.error(error);
      message.client.queue.delete(message.guild.id);
      await channel.leave();
      return message.channel.send(`No me puedo unir al canal: ${error}`).catch(console.error);
    }
  }
};
