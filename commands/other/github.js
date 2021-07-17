const { Discord, discord } = require("discord.js");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const fetch = require("node-fetch");

module.exports = {
  name: "github",
  description: 'Github command',
  usage: '<Usuario>',
  cooldown: 5,
  guildOnly: true,
  async execute(client, message, args) {
     try {

  if (!args[0]) return message.channel.send(`Por favor escribe un nombre!`)
    
  fetch(`https://api.github.com/users/${args.join('-')}`)
    .then(res => res.json()).then(body => {
      if(body.message) return message.channel.send(`No se encontro una persona con ese nombre!`);
    let { login, avatar_url, name, id, html_url, public_repos, followers, following, location, created_at, bio, twitter_username, blog } = body;
    const twitter = twitter_username
      ? `[@${twitter_username}](https://twitter.com/${twitter_username})`
      : "No hay Twitter";

            const embed = new MessageEmbed()
            .setAuthor(`${login} Información!`, avatar_url)
            .setColor(`#211F1F`)
            .setThumbnail(`${avatar_url}`)
            .addField(`Nombre`, `${login}`, true)
            .addField(`ID`, `${id}`, true)
            .addField(`Biografía`, `${bio || "No Bio"}`)
            .addField(`Repositorios publicos`, `${public_repos || "Ninguno"}`, true)
            .addField(`Seguidores`, `${followers}`, true)
            .addField(`Seguidos`, `${following}`, true)
            .addField(`Localización`, `${location || "No hay Localización"}`, true)
            .addField(`Twitter`, `${twitter}`, true)
            .addField(`Pagina`, `${blog || "No hay Pagina"}`, true)
            .addField(`Cuenta Creada`, moment.utc(created_at).format("dddd, MMMM, Do YYYY"))
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')

            message.channel.send(embed);

    })

        } catch (error) {
            console.log(`[Commands] [github] Getting Error In github Command :\n`, error);
            return message.channel.send(`Se produció un error.`)
        }
}}