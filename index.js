/**
 * Module Imports
 */
 const Keyv = require("keyv");
 const { Client, Collection } = require("discord.js");
 const Discord = require('discord.js');
 const { readdirSync } = require("fs");
 const SQLite = require("better-sqlite3")
 const sql = new SQLite('./mainDB.sqlite')
 const { MessageEmbed } = require("discord.js");
 const { join } = require("path");
 const config = require("./config.json");
 const fs = require("fs")
 const { getLevelChannel } = require("./util/functions");
 const db = require("quick.db")
 const { TOKEN, PREFIX, LOGSBOT } = require("./config.json");
 const mongoose = require("mongoose");
 const Guild = require("./models/Guild.js");
 require("dotenv").config();
 
 const client = new Client({ disableMentions: "everyone" });
 
 client.login(TOKEN);
 client.commands = new Collection();
 client.cooldown = new Collection();
 client.prefix = PREFIX;
 const prefixes = new Keyv("sqlite://db.sqlite");
 const globalPrefix = PREFIX;
 client.queue = new Map();
 const cooldowns = new Collection();
 const talkedRecently = new Map();
 const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
 
 // Init discord giveaways
 const { GiveawaysManager } = require('discord-giveaways');
 client.giveawaysManager = new GiveawaysManager(client, {
     storage: "./giveaways.json",
     updateCountdownEvery: 5000,
     default: {
      botsCanWin: false,
      exemptPermissions: [],
      embedColor: 'GREEN',
      embedColorEnd: '#000000',
      reaction: '🎉',
    }
 });

client.giveawaysManager.on(
  "giveawayReactionAdded",
  async (giveaway, reactor, messageReaction) => {
    if (reactor.user.bot) return;
    const role = client.guilds.cache.get(giveaway.extraData.role);
    if (
      giveaway.extraData.role !== "null" &&
      !reactor.roles.cache.get(giveaway.extraData.role)
    ) {
      messageReaction.users.remove(reactor.user);
    try {
      if(giveaway.extraData){
      await client.guilds.cache.get(giveaway.extraData.server).members.fetch(reactor.id)
      }
      reactor.send(
        new Discord.MessageEmbed()
          .setTimestamp()
          .setTitle(":white_check_mark: Entrada al sorteo! | Tenes chances de ganar!")
          .setDescription(
            `Tu entrada a [Sorteo](https://discord.com/channels/${giveaway.guildID}/${giveaway.channelID}/${giveaway.messageID}) es valida!`
          )
          .setColor("GREEN")
          .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
          .setTimestamp()
      );
    } catch (error) {
       const guildx = client.guilds.cache.get(giveaway.extraData.server)
      messageReaction.users.remove(reactor.user);
      reactor.send( new Discord.MessageEmbed()
          .setTimestamp()
          .setTitle(":x: Entrada denegada!")
          .setDescription(
            `Tu entrada al [Sorteo](https://discord.com/channels/${giveaway.guildID}/${giveaway.channelID}/${giveaway.messageID}) fue denegada porque no cumples con los requisitos**`
          )
          .setColor("RED")
          .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
      );
    }
  }
  });
// Check if user reacts on an ended giveaway
client.giveawaysManager.on('endedGiveawayReactionAdded', (giveaway, member, reaction) => {
     reaction.users.remove(member.user);
     member.send(`**¡Oh, no! ¡Parece que ese sorteo ya terminó!**`)

});


// Dm our winners
client.giveawaysManager.on('giveawayEnded', (giveaway, winners) => {
     winners.forEach((member) => {
         member.send(new Discord.MessageEmbed()
         .setTitle(`🎁 Ganador!`)
         .setDescription(`Hola ${member.user}\n Ganaste el **[[Sorteo]](https://discord.com/channels/${giveaway.guildID}/${giveaway.channelID}/${giveaway.messageID})**\n Ganaste **${giveaway.prize}!**`)
         .setTimestamp()
         .setColor("GREEN")
         .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
         );
     });
});
// Dm Rerolled winners
client.giveawaysManager.on('giveawayRerolled', (giveaway, winners) => {
     winners.forEach((member) => {
         member.send(new Discord.MessageEmbed().catch(error => console.log(`${reactor.user.tag} No puede recibir mensajes privados ya que los tiene cerrados`))
         .setTitle(`🎁 Ganador del reroll!`)
         .setDescription(`Hola ${member.user}\n Hicieron reroll y ganaste el **[[Sorteo]](https://discord.com/channels/${giveaway.guildID}/${giveaway.channelID}/${giveaway.messageID})**\n Ganaste **${giveaway.prize}!**`)
         .setTimestamp()
         .setColor("GREEN")
         .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
         );
     });
});
 
 
 client.on("guildCreate", guild => {
 
 let defaultChannel = "";
 guild.channels.cache.forEach((channel) => {
   if(channel.type == "text" && defaultChannel == "") {
     if(channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
       defaultChannel = channel;
     }
   }
 })
     let welcomeEmbed = new MessageEmbed()
       .setTitle("Gracias por Invitarme!")
       .setDescription(`[Invite](https://discord.com/api/oauth2/authorize?client_id=744656460826411152&permissions=8&scope=bot) | [Server Support](https://discord.gg/erJmTGr) | [Pagina](https://galacticbot.xyz/)\n\nHola, gracias por invitarme a ${guild.name}.\n\nMi Prefix es **=**\n\nTambién puedes cambiarme mi prefix con el comando **=prefix <nuevo prefix>**\nPara ver toda la lista de mis comandos usa **=help**`)
       .setColor("GREEN")
       .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
       .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
       .setTimestamp();
 defaultChannel.send(welcomeEmbed);
 
 
 });
 
 
 /* 
 
                    DM LOGGERS
 
 */ 
 client.on('message', async message => {
   if (message.author.bot) return;
   if (message.channel.type === "dm") {
     if (message.author.id === client.user.id) return;
         const embed = new MessageEmbed()
           .setTitle("Galactic DM Log")
           .setColor("BLUE")
           .setAuthor(message.author.tag, message.author.displayAvatarURL())
           .addField("Username", `${message.author}`, true)
           .addField("Message", message.content,true )
           .setTimestamp()
           .setThumbnail('https://i.imgur.com/ThUnm8a.png')
       .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
         client.channels.cache.get(config.DMLOG).send(embed)
       } 
     });
  
 
  async function start() {
     console.log("Connecting to database...");
 
     await mongoose.connect(process.env.DATABASE_URL, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         useCreateIndex: true,
         useFindAndModify: false
     });   
     
 
 /**
  * Client Events
  */
 
 client.on("ready", () => {
   const levelTable = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'levels';").get();
   if (!levelTable['count(*)']) {
     sql.prepare("CREATE TABLE levels (id TEXT PRIMARY KEY, user TEXT, guild TEXT, xp INTEGER, level INTEGER, totalXP INTEGER);").run();
   }
 
   client.getLevel = sql.prepare("SELECT * FROM levels WHERE user = ? AND guild = ?");
   client.setLevel = sql.prepare("INSERT OR REPLACE INTO levels (id, user, guild, xp, level, totalXP) VALUES (@id, @user, @guild, @xp, @level, @totalXP);");
 // Role table for levels
   const roleTable = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'roles';").get();
   if (!roleTable['count(*)']) {
     sql.prepare("CREATE TABLE roles (guildID TEXT, roleID TEXT, level INTEGER);").run();
   }
     console.log('');
     console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=');
     console.log(`Listo! Canales ${client.channels.cache.size}, Usuarios ${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)} y Servidores ${client.guilds.cache.size}.`);
     console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=');
     console.log('');
   var interval = setInterval (function () {
   var p = Math.floor(Math.random()*6);
   if(p==1){
     client.user.setActivity(`${client.guilds.cache.size} servidores`, { type: 'WATCHING' });
   }
   if(p==2){
     client.user.setActivity(`${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)} miembros`, { type: 'WATCHING' });
   }
   if(p==3){
     client.user.setActivity(`=help`, { type: 'LISTENING' });
   }
   if(p==4){
     client.user.setActivity(`${client.channels.cache.size} canales`, { type: 'PLAYING' });
   }
   if(p==5){
     client.user.setActivity(`Soporte: galacticbot.xyz/discord`, { type: 'PLAYING' });
   }
   if(p==6){
     client.user.setActivity(`Invite: galacticbot.xyz/invite`, { type: 'PLAYING' });
   }
 }, 1 * 10000);
 });
 
 client.on("warn", (info) => console.log(info));
 client.on("error", console.error);
 
 client.on("guildCreate", guild => {
   if (!LOGSBOT || LOGSBOT === "") return;
   client.channels.cache.get(LOGSBOT).send(`Entré a un nuevo server: ${guild.name} | ID: ${guild.id}). El server tiene ${guild.memberCount} miembros!`);
 });
 
 client.on("guildDelete", guild => {
   if (!LOGSBOT || LOGSBOT === "") return;
   client.channels.cache.get(LOGSBOT).send(`Me sacaron de un servidor: ${guild.name} | ID: ${guild.id})`);
 });
 
 
   const eventFiles = readdirSync("./events/").filter((file) =>
     file.endsWith(".js")
   );
 
   eventFiles.forEach((file) => {
     const event = require(`./events/${file}`);
 
     if (!event.execute)
       throw new TypeError(
         `[ERROR]: execute function is required for events! (${file})`
       );
 
     if (!event.name)
       throw new TypeError(`[ERROR]: name is required for events! (${file})`);
 
     client.on(event.name, event.execute.bind(null, client));
 
     delete require.cache[require.resolve(`./events/${file}`)];
 
     // debug
     console.log(`[INFO][EVENT]: Loaded ${event.name}`);
   });
 
 
 /**
  * Import all commands
  */
 fs.readdir("./commands/", (err, files) => {
     if (err) return console.error(err);
     files.forEach(file => {
         if (!file.endsWith(".js")) return;
         let props = require(`./commands/${file}`);
         let commandName = file.split(".")[0];
         console.log(`Loading music command ${commandName}`);
         client.commands.set(commandName, props);
     });
 });

    console.log("Loading modifiers...");
    const modifiers = fs.readdirSync(`./modifiers`);

    for (const modifier of modifiers) {
        if (!modifier.endsWith(".js")) continue;
        require(`./modifiers/${modifier}`)(client);
    }
 
 /**
  * Import all commands
  */
 fs.readdir("./commands/minigames/", (err, files) => {
     if (err) return console.error(err);
     files.forEach(file => {
         if (!file.endsWith(".js")) return;
         let props = require(`./commands/minigames/${file}`);
         let commandName = file.split(".")[0];
         console.log(`Loading minigames command ${commandName}`);
         client.commands.set(commandName, props);
     });
 });
 
 /**
  * Import all commands
  */
  fs.readdir("./commands/verification/", (err, files) => {
   if (err) return console.error(err);
   files.forEach(file => {
       if (!file.endsWith(".js")) return;
       let props = require(`./commands/verification/${file}`);
       let commandName = file.split(".")[0];
       console.log(`Loading verification command ${commandName}`);
       client.commands.set(commandName, props);
   });
 });
 
 
 /**
  * Import all commands
  */
 fs.readdir("./commands/fun/", (err, files) => {
     if (err) return console.error(err);
     files.forEach(file => {
         if (!file.endsWith(".js")) return;
         let props = require(`./commands/fun/${file}`);
         let commandName = file.split(".")[0];
         console.log(`Loading fun command ${commandName}`);
         client.commands.set(commandName, props);
     });
 });
 
 /**
  * Import all commands
  */
 fs.readdir("./commands/other/", (err, files) => {
     if (err) return console.error(err);
     files.forEach(file => {
         if (!file.endsWith(".js")) return;
         let props = require(`./commands/other/${file}`);
         let commandName = file.split(".")[0];
         console.log(`Loading others command ${commandName}`);
         client.commands.set(commandName, props);
     });
 });
 
 /**
  * Import all commands
  */
 fs.readdir("./commands/backup/", (err, files) => {
     if (err) return console.error(err);
     files.forEach(file => {
         if (!file.endsWith(".js")) return;
         let props = require(`./commands/backup/${file}`);
         let commandName = file.split(".")[0];
         console.log(`Loading backup command ${commandName}`);
         client.commands.set(commandName, props);
     });
 });
 
 /**
  * Import all commands
  */
 fs.readdir("./commands/help/", (err, files) => {
     if (err) return console.error(err);
     files.forEach(file => {
         if (!file.endsWith(".js")) return;
         let props = require(`./commands/help/${file}`);
         let commandName = file.split(".")[0];
         console.log(`Loading help command ${commandName}`);
         client.commands.set(commandName, props);
     });
 });
 
 /**
  * Import all commands
  */
 fs.readdir("./commands/moderation/", (err, files) => {
     if (err) return console.error(err);
     files.forEach(file => {
         if (!file.endsWith(".js")) return;
         let props = require(`./commands/moderation/${file}`);
         let commandName = file.split(".")[0];
         console.log(`Loading moderations command ${commandName}`);
         client.commands.set(commandName, props);
     });
 });
 
 /**
  * Import all commands
  */
 fs.readdir("./commands/owner/", (err, files) => {
     if (err) return console.error(err);
     files.forEach(file => {
         if (!file.endsWith(".js")) return;
         let props = require(`./commands/owner/${file}`);
         let commandName = file.split(".")[0];
         console.log(`Loading owner command ${commandName}`);
         client.commands.set(commandName, props);
     });
 });
 
 client.on("message", async (message) => {
   if (message.author.bot) return;
   if (!message.guild) return;
   let args;
 
   if (message.guild) {
     const botTag = `<@!${message.client.user.id}> `;
     let prefix;
     const guildPrefix = await prefixes.get(message.guild.id);
 
     if (message.content.startsWith(botTag)) {
       prefix = botTag; //used only for cmd processing
       message.client.prefix = guildPrefix ? guildPrefix : globalPrefix; //used in commands
     } else if (message.content.startsWith(globalPrefix) && !guildPrefix) {
       prefix = globalPrefix;
       message.client.prefix = globalPrefix;
     } else {
       const guildPrefix = await prefixes.get(message.guild.id);
       if (message.content.startsWith(guildPrefix)) {
       prefix = guildPrefix;
       message.client.prefix = guildPrefix;
       }
     }
     if (!prefix) return;
     args = message.content.slice(prefix.length).split(/\s+/);
   } else {
     const slice = message.content.startsWith(globalPrefix) ? globalPrefix.length : 0;
     args = message.content.slice(slice).split(/\s+/);
   }
 
   let checkingBlacklistedMembers = db.fetch(`blacklisted_${message.author.id}`)
   if (checkingBlacklistedMembers === null) {
       checkingBlacklistedMembers === false
   }
 
 
   let blacklistedEmbed = new MessageEmbed()
       .setTitle("TU ESTAS BLACKLISTEADO")
       .setColor("RED")
       .setDescription("Tu estas blacklisteado y no puedes usar mis comandos. Si quieres apelar tu blacklist, por favor hablale al MD a <@!664254535509868556> para mas información.")
       .setFooter(`${client.user.username}`, client.user.avatarURL())
 
   if (checkingBlacklistedMembers === true) return message.channel.send(blacklistedEmbed)
 
   const commandName = args.shift().toLowerCase();
 
 
   const command =
     client.commands.get(commandName) ||
     client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
 
   if (!command) return;
 
   if (!cooldowns.has(command.name)) {
     cooldowns.set(command.name, new Collection());
   }
 
   const now = Date.now();
   const timestamps = cooldowns.get(command.name);
   const cooldownAmount = (command.cooldown || 1) * 1000;
 
   if (timestamps.has(message.author.id)) {
     const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
 
     if (now < expirationTime) {
       const timeLeft = (expirationTime - now) / 1000;
       return message.reply(
         `Por favor espera ${timeLeft.toFixed(1)} segundos para volver a usar el comando \`${command.name}\``
       );
     }
   }
 
 
   timestamps.set(message.author.id, now);
   setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
 
 
   try {
     command.execute(client, message, args);
   } catch (error) {
     console.error(error);
     message.reply("Hay un error, contactate con Chicho#1337").catch(console.error);
   } finally {
     if (!LOGSBOT || LOGSBOT === "") return;
     client.channels.cache.get(LOGSBOT).send(`${message.author.tag} uso el **${command.name}** en ${message.channel.name} | ${message.guild.name} | ${message.guild.id}`)  
   }
 });
 
 // XP Messages 
 client.on("message", async (message) => {
   if(message.author.bot) return;
   if(message.channel.type === "dm") return;
         // get level and set level
         const level = client.getLevel.get(message.author.id, message.guild.id) 
         if(!level) {
           let insertLevel = sql.prepare("INSERT OR REPLACE INTO levels (id, user, guild, xp, level, totalXP) VALUES (?,?,?,?,?,?);");
           insertLevel.run(`${message.author.id}-${message.guild.id}`, message.author.id, message.guild.id, 0, 0, 0)
           return;
         }
       
         const lvl = level.level;
 
       // xp system
         const generatedXp = Math.floor(Math.random() * 16);
         const nextXP = level.level * 2 * 250 + 250
         // message content or characters length has to be more than 4 characters also cooldown
       if(talkedRecently.get(message.author.id)) {
         return;
       } else { // cooldown is 10 seconds
             level.xp += generatedXp;
             level.totalXP += generatedXp;
             
 
       // level up!
         if(level.xp >= nextXP) {
                 level.xp = 0;
                 level.level += 1;
 
                 const levelChannel = await getLevelChannel(message.channel.guild.id);
 
                 // not enabled
                 if (levelChannel === null || !levelChannel) return;
         
                 // channel not found/deleted
                 if (
                   !message.channel.guild.channels.cache.some((ch) => ch.name === levelChannel.name)
                 )
                   return;
 
         let embed = new MessageEmbed()
               .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
               .setDescription(`**Felicitaciones** ${message.author}! Subiste al nivel **${level.level}**`)
               .setColor("BLUE")
               .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
               .setTimestamp();
         // using try catch if bot have perms to send EMBED_LINKS      
         try {
           client.channels.cache.get(levelChannel.id).send({ embed });   
         } catch (err) { 
         }
       };
       client.setLevel.run(level);
       // add cooldown to user
   talkedRecently.set(message.author.id, Date.now() + 10 * 1000);
   setTimeout(() => talkedRecently.delete(message.author.id, Date.now() + 10 * 1000))    
       }
             // level up, time to add level roles
             const member = message.member;
             let Roles = sql.prepare("SELECT * FROM roles WHERE guildID = ? AND level = ?")
             
             let roles = Roles.get(message.guild.id, lvl)
             if(!roles) return;
             if(lvl >= roles.level) {
             if(roles) {
             if (member.roles.cache.get(roles.roleID)) {
               return;
             }
                if(!message.guild.me.hasPermission("MANAGE_ROLES")) {
                  return
                }
              member.roles.add(roles.roleID);
             }}
 })
  }
  start();