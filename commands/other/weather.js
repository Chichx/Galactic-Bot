const Discord = require('discord.js');
const weather = require('weather-js');

module.exports = {
    name: "weather",
    description: 'Weather command',
    usage: '<Pais>',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args) {

        const nolocationEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ No hay ninguna localización mencionada`)
      .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')

        weather.find({
            search: args.join(" "),
            degreeType: 'C'
          }, function(err, result) {
            //if (err) console.log(err);
            if (result === undefined || result.length === 0) return message.channel.send(nolocationEmbed).then(message => {message.delete(5000)});
            var current = result[0].current;
            const tempF = [Math.round(current.temperature * 1.8) + 32];
            const feelslikeF = [Math.round(current.feelslike * 1.8) + 32];
            const embed = new Discord.MessageEmbed()
                .setDescription(`**${current.skytext}**`)
                .setAuthor(`Clima de ${current.observationpoint}`)
                .setThumbnail(current.imageUrl)
                .setColor(0x00AE86)
                .addField('Temperatura', `${current.temperature} °C | ${tempF} °F`, true)
                .addField('Viento', current.winddisplay, true)
                .addField('Humedad', `${current.humidity}%`, true)
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
            message.channel.send({embed});
          })
    }
}