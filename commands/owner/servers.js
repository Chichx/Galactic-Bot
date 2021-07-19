const config = require("../../config.json");
const Discord = require("discord.js");

module.exports = {
  name: "servers",
  description: 'Servers command',
  usage: '',
  cooldown: 5,
  guildOnly: true,
  async execute(client, message, args) {
if(message.author.id !== config.ownerID) {
      return message.channel.send("No eres el creador del Bot.");
    }
 
    await message.delete();
 
let i0 = 0;
let i1 = 10;
let page = 1;
 
let description = 
`Servidores: ${client.guilds.cache.size}\n\n`+
client.guilds.cache.sort((a,b) => b.memberCount-a.memberCount).map((r) => r)
    .map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} ${"Miembros".toLowerCase()} | ${r.id}`)
    .slice(0, 10)
    .join("\n");
 
const embed = new Discord.MessageEmbed()
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setColor(0x7289DA)
    .setFooter(client.user.username)
    .setTitle(`Pagina: ${page}/${Math.ceil(client.guilds.cache.size/10)}`)
    .setDescription(description);
 
const msg = await message.channel.send(embed);
 
await msg.react("⬅");
await msg.react("➡");
await msg.react("❌");
 
const collector = msg.createReactionCollector((reaction, user) => user.id === message.author.id);
collector.on("collect", async(reaction) => {
 
    if(reaction._emoji.name === "⬅") {
 
        i0 = i0-10;
        i1 = i1-10;
        page = page-1;
 
        if(i0 < 0){
            return msg.delete();
        }
        if(!i0 || !i1){
            return msg.delete();
        }
 
        description = `Servidores: ${client.guilds.cache.size}\n\n`+
        client.guilds.cache.sort((a,b) => b.memberCount-a.memberCount).map((r) => r)
            .map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} Miembros | ${r.id}`)
            .slice(i0, i1)
            .join("\n");
 
        embed.setTitle(`Miembros: ${page}/${Math.round(client.guilds.cache.size/10)}`)
            .setDescription(description);
 
        msg.edit(embed);
}
 
    if(reaction._emoji.name === "➡"){
 
        i0 = i0+10;
        i1 = i1+10;
        page = page+1;
 
        if(i1 > client.guilds.cache.size + 10){
            return msg.delete();
        }
        if(!i0 || !i1){
            return msg.delete();
        }
 
        description = `Servidores: ${client.guilds.cache.size}\n\n`+
        client.guilds.cache.sort((a,b) => b.memberCount-a.memberCount).map((r) => r)
            .map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} ${"Miembros".toLowerCase()} | ${r.id}`)
            .slice(i0, i1)
            .join("\n");
 
        embed.setTitle(`Pagina: ${page}/${Math.round(client.guilds.cache.size/10)}`)
            .setDescription(description);
 
        msg.edit(embed);
 
    }
 
    if(reaction._emoji.name === "❌"){
        return msg.delete(); 
    }
 
    await reaction.users.remove(message.author.id);
  });
}}