const ms = require("ms");
const Discord = require("discord.js");
const config = require("../config.json");
module.exports = {
    name: 'gstart',
    description: 'Start giveaway command',
    usage: '',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args) {
  var rolename;
  var BonusEntries;
  // If the member doesn't have enough permissions
  if (
    !message.member.hasPermission("MANAGE_MESSAGES") &&
    !message.member.roles.cache.some(r => r.name === "Giveaways")
  ) {
    return message.channel.send(
      ":x: Debe tener los permisos para comenzar los sorteos."
    );
  }

  // Giveaway channel
  let giveawayChannel = message.mentions.channels.first();
  // If no channel is mentionned
  if (!giveawayChannel) {
    return message.channel.send(":x: Tienes que mencionar un canal válido!");
  }

  // Giveaway duration
  let giveawayDuration = args[1];
  // If the duration isn't valid
  if (!giveawayDuration || isNaN(ms(giveawayDuration))) {
    return message.channel.send(":x: Tienes que especificar una duración válida!");
  }

  // Number of winners
  let giveawayNumberWinners = parseInt(args[2]);
  // If the specified number of winners is not a number
  if (isNaN(giveawayNumberWinners) || parseInt(giveawayNumberWinners) <= 0) {
    return message.channel.send(
      ":x: Tienes que especificar un número válido de ganadores!"
    );
  }

    let role = null;
    if (!args[3])
      return message.channel.send(":x: Tienes que especificar un rango válido\nO escribe **Ninguno** si no quieres tener un rol requerido para entrar al sorteo!")
    role =
      message.guild.roles.cache.get(args[3]) ||
      message.guild.roles.cache.find((role) => role.name == args[3]) ||
      message.guild.roles.cache.find((role) => role.name.includes(args[0])) ||
      message.mentions.roles.first();

    if (!role && !args[3].toLowerCase().startsWith("ninguno"))
      return message.channel.send(
        "Por favor checkea que el rol exista.");
    if (args[3].toLowerCase().startsWith("ninguno")) {
      role = null;
    }

  // Giveaway prize
  let giveawayPrize = args.slice(4).join(" ");
  // If no prize is specified
  if (!giveawayPrize) {
    return message.channel.send(":x: Tienes que especificar un premio válido!");
  }

  message.channel.send("¿Quieres que algun rango tenga un participación extra?\n**Opciones: Si o No**");
  const filter = m => m.author.id === message.author.id;
  await message.channel
    .awaitMessages(filter, {
      max: 1,
      time: 300000,
      errors: ["time"]
    })
    .then(async collected => {
      if (collected.first().content.toLowerCase() === "si") {
        await message.channel.send(
          `Muy bien, ¿qué rol tendrá participaciones extras?`
        );
        await message.channel
          .awaitMessages(filter, {
            max: 1,
            time: 60000,
            errors: ["time"]
          })
          .then(async rolen => {
            const x = await message.guild.roles.cache.find(
              n => n.name === `${rolen.first().content}`
            );
            rolename = rolen.first().content;
            if (!x) {
              message.channel.send(`Rol no encontrado, solo escribe el nombre del rango. **No lo tagees**`);
              rolename = null;
            }
          });
        if (rolename !== null) {
          await message.channel.send(
            `¿Cuántas participaciones extra le darás a ${rolename}?`
          );
          await message.channel
            .awaitMessages(filter, {
              max: 1,
              time: 60000,
              errors: ["time"]
            })
            .then(async rolentery => {
              BonusEntries = parseInt(rolentery.first().content);
              message.channel.send(
                `✅ Bien **${rolename}** tendrá **${BonusEntries}** participacines extra!`
              );
            });
        }
      } else {
        if (collected.first().content.toLowerCase() === "no") {
          message.channel.send("¡Bien! ¡Omitiendo esto!");
          rolename = null;
          BonusEntries = null;
        } else {
          message.channel.send("Respuesta no válida!");
          rolename = null;
          BonusEntries = null;
        }
      }
    });

  // Start the giveaway
  await client.giveawaysManager.start(giveawayChannel, {
    lastChance: {
      enabled: true,
      content: '⚠️ **ULTIMA CHANCE PARA ENTRAR!** ⚠️',
      threshold: 300000,
      embedColor: '#FF0000'
  },
    // The giveaway duration
    time: ms(giveawayDuration),
    // The giveaway prize
    prize: giveawayPrize,
    // The giveaway winner count
    winnerCount: parseInt(giveawayNumberWinners),
    // BonusEntries If Provided

    bonusEntries: [
      {
        // Members who have the role which is assigned to "rolename" get the amount of bonus entries which are assigned to "BonusEntries"
        bonus: new Function(
          "member",
          `return member.roles.cache.some((r) => r.name === \'${rolename}\') ? ${BonusEntries} : null`
        ),
        cumulative: false
      }
    ],
    // Who hosts this giveaway
    hostedBy: config.hostedBy ? message.author : null,
    extraData: {
        role: role == null ? "null" : role.id,
      },
    // Messages
    messages: {
      giveaway: "🎉 **SORTEO** 🎉",
      giveawayEnded: "🎉 **SORTEO TERMINADO** 🎉",
      timeRemaining: `Tiempo Restante: **{duration}**!`,
      inviteToParticipate: `Reacciona al 🎉 para participar!`,
      winMessage: "Felicidades, {winners}! Ganaste **{prize}**!",
      embedFooter: "Termina",
      hostedBy: `Creado por: {user} \n ${
          role == null ? "" : "Rol requerido: " + role.toString()
        }`,
      noWinner: "**¡Uh! Parece que no obtuvimos reacciones en este sorteo**.",
      winners: "Ganador(es)",
      endedAt: "Termino el",
      units: {
        seconds: "seconds",
        minutes: "minutes",
        hours: "hours",
        days: "days",
        pluralS: false // Not needed, because units end with a S so it will automatically removed if the unit value is lower than 2
      }
    }
  });
  if (rolename) {
    const mentionfetch = await message.guild.roles.cache.find(
      n => n.name === `${rolename}`
    );
    let giveaway = new Discord.MessageEmbed()
      .setAuthor(`Participaciones extra!`)
      .setDescription(
        `**${mentionfetch}** tendrá **${BonusEntries}** participanes extra en este sorteo!`
      );
    giveawayChannel.send(giveaway);
  }
  message.channel.send(`Sorteo creado en ${giveawayChannel}!`);
}};