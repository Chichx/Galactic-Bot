module.exports = {
  name: "leave",
  description: 'Leave command',
  usage: '',
  cooldown: 5,
  guildOnly: true,
  execute(client, message, args) {
    if (message.member.voice.channel) {
      message.member.voice.channel.leave();
      message.channel.send({
        embed: {
          title: "Galactic Join!",
          description: "⭕ Bye, sali del canal!",
          color: "GREEN",
         thumbnail: {
          url: "https://i.imgur.com/rVaN5PZ.png"
            },
          timestamp: new Date(),
          footer: {
            icon_url: "https://i.imgur.com/rVaN5PZ.png",
            text: "Galactic Development",
          },
        },
      });
    } else {
      message.channel.send({
        embed: {
          title: "Galactic Join!",
          description: "❗ Tienes que estar en un canal",
          color: "RED",
         thumbnail: {
          url: "https://i.imgur.com/rVaN5PZ.png"
            },
          timestamp: new Date(),
          footer: {
            icon_url: "https://i.imgur.com/rVaN5PZ.png",
            text: "Galactic Development",
          },
        },
      });
    }
  },
};