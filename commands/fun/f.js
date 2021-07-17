const Discord = require("discord.js");

module.exports = {
    name: "f",
    description: 'F command',
    usage: '<@Usuario || Texto>',
    cooldown: 5,
    guildOnly: true,
    execute(client, message, args) {

        if(!args[0]) return message.channel.send('Por favor menciona a una persona o una razón.');

  if(!args[0]) {
    return message.channel.send("Presiona <:f_:780357258692788255> para dar respeto.").then(async msg => {
      await msg.react("756771619594305586");

      const filter = async (reaction, user) => {
        const botReact = await user.bot;
        const userReact = await reaction.message.guild.members.cache.get(user.id);

        if(!botReact) message.channel.send(`**${userReact.user.username}** dió respeto.`);

        return reaction.emoji.id === "780357258692788255";
      }

      const reactions = msg.awaitReactions(filter, { time: 30000 })
      .then(collected => message.channel.send(`**${msg.reactions.cache.get("780357258692788255").count - 1}** personas dieron su respeto.`));
    })
  } else {
    let reason = args.join(" ");
    
    return message.channel.send(`Presiona <:f_:780357258692788255> para dar respeto a **${reason}**`).then(async msg => {
      await msg.react("780357258692788255");

      const filter = async (reaction, user) => {
        const botReact = await user.bot;
        const userReact = await reaction.message.guild.members.cache.get(user.id);

        if(!botReact) message.channel.send(`**${userReact.user.username}** dió respeto.`);

        return reaction.emoji.id === "780357258692788255";
      }

      const reactions = msg.awaitReactions(filter, { time: 60000 })
      .then(collected => message.channel.send(`**${msg.reactions.cache.get("780357258692788255").count - 1}** personas dieron su respeto a **${reason}**`));
    })
  }
}}
