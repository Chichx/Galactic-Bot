const config = require("../config.json");
module.exports = {
    name: 'gcreate',
    description: 'Create giveaway command',
    usage: '',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args) {
  const Discord = require("discord.js");
  const ms = require("ms");
  const currentGiveaways = client.giveawaysManager.giveaways.filter(
    g => g.guildID === message.guild.id && !g.ended
  ).length;
  let time = "";
  let winnersCount;
  let prize = "";
  let channel = "";
  let embed = new Discord.MessageEmbed()
    .setTitle("Crear sorteo!")
    .setColor("#406da2")
    .setFooter(client.user.username, client.user.displayAvatarURL())
    .setTimestamp();
  const msg = await message.channel.send(
    embed.setDescription(
      "¿En qué canal le gustaría que comience el sorteo? \n Por favor, etiquete el canal o proporcione su ID. \n ** ¡Debe responder en 30 segundos! **"
    )
  )
  let xembed = new Discord.MessageEmbed()
    .setTitle("¡UPS! ¡Te tomaste mucho tiempo para responder! 🕖")
    .setColor("#FF0000")
    .setDescription('💥 ¡Te tomaste demasiado tiempo para decidirte! \n ¡Usa ``gcreate`` nuevamente para comenzar un nuevo sorteo! \nEsta vez, intenta responder en **30 segundos**!')
    .setFooter(client.user.username, client.user.displayAvatarURL())
    .setTimestamp()

  const filter = m => m.author.id === message.author.id && !m.author.bot
  const collector = await message.channel.createMessageCollector(filter, {
    max: 3,
    time: 30000
  })

  collector.on("collect", async collect => {

    const response = collect.content
    let chn =
      collect.mentions.channels.first() ||
      message.guild.channels.cache.get(response)
    await collect.delete()
    if (!chn) {
      return msg.edit(
        embed.setDescription(
          "¡Uh! ¡Parece que proporcionaste un canal no válido!"
        )
      )
    } else {
      channel = chn
      collector.stop(
        msg.edit(
          embed.setDescription(
            `¡Bien! A continuación, ¿cuanto tiempo quiere que dure el sorteo en ${channel}? \n**¡Debe responder en 30 segundos!**`
          )
        )
      );
    }
    const collector2 = await message.channel.createMessageCollector(filter, {
      max: 3,
      time: 30000
    });
    collector2.on("collect", async collect2 => {

      let mss = ms(collect2.content);
      await collect2.delete()
      if (!mss) {
        return msg.edit(
          embed.setDescription(
            "¡Oh, no! Parece que me proporcionaste una duración no válida!"
          )
        );
      } else {
        time = mss;
        collector2.stop(
          msg.edit(
            embed.setDescription(
              `¡Bien! A continuación, ¿cuantas personas quieres que ganen el sorteo? \n **¡Debe responder en 30 segundos.!**`
            )
          )
        );
      }
      const collector3 = await message.channel.createMessageCollector(filter, {
        max: 3,
        time: 30000,
        errors: ['time']
      });
      collector3.on("collect", async collect3 => {


        const response3 = collect3.content.toLowerCase()
        await collect3.delete()
        if (parseInt(response3) < 1 || isNaN(parseInt(response3))) {
          return msg.edit(
            embed.setDescription(
              "¡Oh, no! Parece que me proporcionaste una numero no válido!"
            )
          );
        } else {
          winnersCount = parseInt(response3);
          collector3.stop(
            msg.edit(
              embed.setDescription(
                `¡Muy bien! A continuación, ¿cuál debería ser el premio del sorteo? \n **¡Debe responder en 30 segundos!**`
              )
            )
          );
        }
        const collector4 = await message.channel.createMessageCollector(
          filter,
          { max: 3, time: 30000 }
        );
        collector4.on("collect", async collect4 => {

          const response4 = collect4.content.toLowerCase();
          prize = response4;
          await collect4.delete()
          collector4.stop(
            msg.edit(
              embed.setDescription(
                "¡Bien! A continuación, ¿desea tener un requisito de unirse al servidor para el sorteo? Si es así, ¡proporcione el enlace de invitación permanente del servidor! \n **¡Debe responder en 30 segundos!** \n** ¡El bot debe estar en el servidor!** \n **¡Responda con ``ninguno'' si no quieres poner ningun servidor!**"
              )
            )
          );
          const collector5 = await message.channel.createMessageCollector(
            filter,
            { max: 1, time: 30000 }
          );
          collector5.on("collect", async collect5 => {
            const response5 = collect5.content;
            await collect5.delete()
            if (response5.toLowerCase() !== "ninguno") {
              client.fetchInvite(response5).then(async invite => {
                let client_is_in_server = client.guilds.cache.get(
                  invite.guild.id
                );
                if (!client_is_in_server) {
                  return message.channel.send({
                    embed: {
                      color: 000000,
                      author: {
                        name: client.user.username,
                        icon_url: client.user.avatarURL
                      },
                      title: "Server Check!",
                      url: "https://github.com/Gastxn",
                      description:
                        "¡Woah, woah, woah! ¡Veo un nuevo servidor! ¿Estás seguro de que estoy en ese server? ¡Debes invitarme allí para establecer el requisito! 😳",
                      timestamp: new Date(),
                      footer: {
                        icon_url: client.user.avatarURL,
                        text: "Server Check"
                      }
                    }
                  });

                }

                collector5.stop(
                  msg.edit(
                    embed.setDescription(
                      `Bien! El sorteo empezó en ${channel} con el premio **${prize}** que durará **${ms(
                        time,
                        { long: true }
                      )}** y habrá **${winnersCount}** ganador(es)! Y los usuarios tendrían que unirse a ${response5}`
                    )
                  )
                )
                client.giveawaysManager.start(channel, {
                  lastChance: {
                    enabled: true,
                    content: '⚠️ **ULTIMA CHANCE PARA ENTRAR!** ⚠️',
                    threshold: 300000,
                    embedColor: '#FF0000'
                },
                  time: parseInt(time),
                  prize: prize,
                  hostedBy: config.hostedBy ? message.author : null,
                  winnerCount: parseInt(winnersCount),
                  messages: {
                    giveaway: "🎉 **SORTEO** 🎉",
                    giveawayEnded: "🎉 **SORTEO TERMINADO** 🎉",
                    timeRemaining: `Tiempo Restante: **{duration}**!`,
                    inviteToParticipate: `Reacciona al 🎉 para participar!\n\nRequisito para entrar\nal sorteo: ${response5}\n`,
                    winMessage: "Felicidades, {winners}! Ganaste **{prize}**!",
                    embedFooter: "Termina",
                    hostedBy: "Creado por: {user}",
                    noWinner: "**¡Uh! Parece que no obtuvimos reacciones en este sorteo**.",
                    winners: "Ganador(es)",
                    endedAt: "Termino el",
                    units: {
                      seconds: "seconds",
                      minutes: "minutes",
                      hours: "hours",
                      days: "days"
                    }
                  },
                  extraData: {
                    server: `${invite.guild.id}`
                  }
                })
              });
            } else {
              return message.channel.send(`**Porfavor usa \`\`gstart\`\` en lugar de hacer un sorteo sin un requisito de servidor**`)
            }
          });
        });
      });
    });
  });
  collector.on('end', (collected, reason) => {
    if (reason == 'time') {
      message.channel.send(xembed)
    }
  })
  try {
    collector2.on('end', (collected, reason) => {
      if (reason == 'time') {

        message.channel.send(xembed)
      }
    });
    collector3.on('end', (collected, reason) => {
      if (reason == 'time') {
        message.channel.send(xembed)

      }
    })
    collector4.on('end', (collected, reason) => {
      if (reason == 'time') {

        message.channel.send(xembed)
      }
    })
    collector5.on('end', (collected, reason) => {
      if (reason == 'time') {

        message.channel.send(xembed)
      }
    })
  } catch (e) {

  }
}}