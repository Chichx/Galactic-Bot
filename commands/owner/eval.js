const Discord = require("discord.js"),
      { post } = require("node-superfetch");
      const config = require("../../config.json");      

      module.exports = {
        name: "eval",
        description: 'Eval command',
        usage: '<Code>',
        cooldown: 5,
        guildOnly: true,
        async execute(client, message, args) {

  if(message.author.id !== config.ownerID) {
    return message.channel.send("No eres el creador del Bot.");
  }
  
  const embed = new Discord.MessageEmbed()
  .addField("Entrada", "```js\n" + args.join(" ") + "```");
  
  try {
    const code = args.join(" ");
    if (!code) return message.channel.send("Por favor Escribe un codigo");
    let evaled;
    

    if (code.includes(`SECRET`) || code.includes(`TOKEN`) || code.includes("process.env")) {
      evaled = "Que mierda queres hacer con el token?";
    } else {
      evaled = eval(code);
    }
    
    if (typeof evaled !== "string") evaled = require("util").inspect(evaled, {depth: 0});
    
    let output = clean(evaled);
    if (output.length > 1024) {

      const {body} = await post("https://hastebin.com/documents").send(output);
      embed.addField("Salida", `https://hastebin.com/${body.key}.js`).setColor(0x7289DA);

    } else {
      embed.addField("Salida", "```js\n" + output + "```").setColor(0x7289DA)
    }
    
    message.channel.send(embed);
    
  } catch (error) {
    let err = clean(error);
    if (err.length > 1024) {

      const {body} = await post("https://hastebin.com/documents").send(err);
      embed.addField("Salida", `https://hastebin.com/${body.key}.js`).setColor("RED");
    } else {
      embed.addField("Salida", "```js\n" + err + "```").setColor("RED");
    }
    
    message.channel.send(embed);
  }
}}

function clean(string) {
    if (typeof text === "string") {
      return string.replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203))
    } else {
      return string;
    }
  }