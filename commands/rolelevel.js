const Discord = require("discord.js");
const Keyv = require("keyv");
const prefixes = new Keyv("sqlite://db.sqlite");
const { PREFIX } = require("../config.json");
const SQlite = require("better-sqlite3");
const sql = new SQlite('./mainDB.sqlite');
const client = new Discord.Client();

module.exports = {
    name: 'role-level',
    description: 'Role Level command',
    usage: '',
    cooldown: 5,
    guildOnly: true,
    async execute (client, message, args) {
        if(!message.guild.me.hasPermission("MANAGE_ROLES")) return message.reply(`Tu no tienes permisos para usar este comando!`);
        if(!message.member.hasPermission("MANAGE_ROLES") || !message.member.hasPermission("MANAGE_GUILD")) return message.reply(`You do not have permission to use this command!`);


        if(!args.length) {
            let embed = new Discord.MessageEmbed()
            .setTitle(`Recompensas de niveles!`)
            .setDescription(`Recompensa cuando una persona llega a determinado nivel`)
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
            .addFields({ name: `${(await prefixes.get(message.guild.id)) || PREFIX}rolelevel add <level> <@role>`, value: `Agrega el rol cuando la persona llega a determinado nivel.`})
            .addFields({ name: `${(await prefixes.get(message.guild.id)) || PREFIX}rolelevel remove <level>`, value: `Borra la recompensa de roles al determinado nivel.`})
            .addFields({ name: `${(await prefixes.get(message.guild.id)) || PREFIX}rolelevel show`, value: `Muestra la lista de roles y niveles.`})
            .setColor("RANDOM");

        return message.channel.send(embed);
        }

        const method = args[0]
        const levelArgs = parseInt(args[1])
        args.shift()
        args.shift()
        const roleName = args.join(' ')

        const role = message.guild.roles.cache.find(r => (r.name === roleName.toString()) || (r.id === roleName.toString().replace(/[^\w\s]/gi, '')));
        client.getRole = sql.prepare("SELECT * FROM roles WHERE guildID = ? AND roleID = ? AND level = ?");
        client.setRole = sql.prepare("INSERT OR REPLACE INTO roles (guildID, roleID, level) VALUES (@guildID, @roleID, @level);");

        if(method === 'add') {
            if(isNaN(levelArgs) && !levelArgs || levelArgs < 1) {
                return message.reply(`Por favor menciona un nivel!`);
            } else {
                if(!role) {
                    return message.reply(`Por favor menciona un rol!`);
                } else {
                let Role = client.getRole.get(message.guild.id, role.id, levelArgs) 
                if(!Role) {
                    Role = {
                    guildID: message.guild.id,
                    roleID: role.id,
                    level: levelArgs
                    }
                    client.setRole.run(Role)
                    let embed = new Discord.MessageEmbed()
                    .setTitle(`Actulización realizada correctamente!`)
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
                    .setDescription(`${role} fue puesto para el nivel ${levelArgs}`)
                    .setColor("RANDOM");
                     return message.channel.send(embed);
                 } else if(Role){
                    client.deleteLevel = sql.prepare(`DELETE FROM roles WHERE guildID = ? AND roleID = ? AND level = ?`)
                    client.deleteLevel.run(message.guild.id, role.id, levelArgs);
                    client.updateLevel = sql.prepare(`INSERT INTO roles(guildID, roleID, level) VALUES(?,?,?)`)
                    client.updateLevel.run(message.guild.id, role.id, levelArgs)
                     let embed = new Discord.MessageEmbed()
                     .setTitle(`Actulización realizada correctamente!`)
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
                     .setDescription(`${role} fue actualizado correctamente al nivel ${levelArgs}`)
                     .setColor("RANDOM");
                      return message.channel.send(embed);
                 }
                }
            }
        }

        if(method === 'show') {
            const allRoles = sql.prepare(`SELECT * FROM roles WHERE guildID = ?`).all(message.guild.id)
            if(!allRoles) {
                return message.reply(`No hay ningun rol con ningun nivel!`)
            } else {
                let embed = new Discord.MessageEmbed()
                .setTitle(`${message.guild.name} Niveles de roles`)
                .setColor("RANDOM");
                for(const data of allRoles) {
                    let LevelSet = data.level;
                    let RolesSet = data.roleID;
                 embed.addFields({ name: `\u200b`, value: `**Nivel ${LevelSet}**: <@&${RolesSet}>` }); 
                }
                return message.channel.send({embed});
            }
        }

        client.getLevel = sql.prepare(`SELECT * FROM roles WHERE guildID = ? AND level = ?`)
        const levels = client.getLevel.get(message.guild.id, levelArgs)

        if(method === 'remove' || method === 'delete') {
            if(isNaN(levelArgs) && !levelArgs || levelArgs < 1) {
                return message.reply(`Por favor menciona un rol para borrar!`);
            } else {
                if(!levels) {
                    return message.reply(`No es un nivel valido!`);
                } else {
                    client.deleteLevel = sql.prepare(`DELETE FROM roles WHERE guildID = ? AND level = ?`)
                    client.deleteLevel.run(message.guild.id, levelArgs);
                    let embed = new Discord.MessageEmbed()
                    .setTitle(`Actulización realizada correctamente!`)
                    .setDescription(`Las recompensas del nivel ${levelArgs} fueron removidas.`)
                    .setColor("RANDOM");
                     return message.channel.send(embed);
                }
            }
        }

    }
}