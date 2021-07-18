const db = require("quick.db");
const Keyv = require("keyv");
const prefixes = new Keyv("sqlite://db.sqlite");
const { PREFIX } = require("../config.json");
const { MessageEmbed } = require("discord.js");
  const {
  getBlacklistWords,
} = require("../util/functions");

module.exports = {
  name: "message",
  async execute(bot, message) {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;
    const guildId = message.guild.id;
    const userId = message.author.id;
    const blacklistedWords = await getBlacklistWords(guildId);
  let prefix = `${(await prefixes.get(message.guild.id)) || PREFIX}`;

if(db.has(`afk-${message.author.id}+${message.guild.id}`)) {
        const info = db.get(`afk-${message.author.id}+${message.guild.id}`)
        await db.delete(`afk-${message.author.id}+${message.guild.id}`)
        message.member.setNickname(`${message.author.username}`)
        message.reply(`Tu estado de AFK fue removido. Tu AFK estado de AFK era: ${info}`)
      }
    if(message.mentions.members.first()) {
        if(db.has(`afk-${message.mentions.members.first().id}+${message.guild.id}`)) {
            message.reply(`${message.mentions.members.first().user.tag} Está **AFK**\n**Razón:** ` + db.get(`afk-${message.mentions.members.first().id}+${message.guild.id}`))
        }else return;
    }else;

    if (!message.content.includes("!blacklistedwords") && !message.author.bot) {
      blacklistedWords !== null &&
        blacklistedWords.forEach((word) => {
          if (message.content.toLowerCase().includes(word.toLowerCase())) {
            message.delete();
            return message
              .reply(
                "Estas usando una palabra bloqueada, por favor deja de usarla."
              )
              .then((msg) => {
                setTimeout(() => {
                  msg.delete();
                }, 5000);
              });
          }
        });
    }

  if (!message.content.startsWith(prefix)) return;

  if (!message.member)
    message.member = await message.guild.fetchMember(message);

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;

let cmdx = db.get(`cmd_${message.guild.id}`)

    if (cmdx) {
      const customy = cmdx.find((x) => x.name === cmd);
      if (customy) message.channel.send(customy.response);
   
}
 

  },
};