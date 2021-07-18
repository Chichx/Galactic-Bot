const Discord = require("discord.js");
const SQlite = require("better-sqlite3");
const sql = new SQlite('./mainDB.sqlite');
const client = new Discord.Client();

module.exports = {
    name: 'set-level',
    description: 'Set Level command',
    usage: '<@Usuario> || <Numero>',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args) {
        let userArray = message.content.split(" ");
        let userArgs = userArray.slice(1);
        let user = message.mentions.members.first() || message.guild.members.cache.get(userArgs[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === userArgs.slice(0).join(" ") || x.user.username === userArgs[0])

        if(!message.member.hasPermission("MANAGE_GUILD")) return message.reply(`Tu no tienes permiso para usar este comando`);

        const levelArgs = parseInt(args[1])

        client.getScore = sql.prepare("SELECT * FROM levels WHERE user = ? AND guild = ?");
        client.setScore = sql.prepare("INSERT OR REPLACE INTO levels (id, user, guild, xp, level, totalXP) VALUES (@id, @user, @guild, @xp, @level, @totalXP);");
        if(!user) {
            return message.reply(`Porfavor menciona a un usuario!`)
        } else {
            if(isNaN(levelArgs) || levelArgs < 1) {
                return message.reply(`Porfavor menciona un numero!`)
            } else {
                let score = client.getScore.get(user.id, message.guild.id);
                if(!score) {
                    score = {
                        id: `${message.guild.id}-${user.id}`,
                        user: user.id,
                        guild: message.guild.id,
                        xp: 0,
                        level: 0,
                        totalXP: 0
                    }
                }
                score.level = levelArgs
                const newTotalXP = levelArgs - 1
                let embed = new Discord.MessageEmbed()
                .setTitle(`Listo!`)
                .setDescription(`Se agregaron ${levelArgs} niveles a ${user.toString()}!`)
                .setColor("RANDOM");
                score.totalXP = newTotalXP * 2 * 250 + 250
                score.xp = 0
                client.setScore.run(score)
                return message.channel.send(embed)
            }
        }
    }
}