const Discord = require("discord.js");

module.exports = {
    name: "binary",
    description: 'Binary command',
    usage: '<encode, decode> || <Texto>',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args) {
    if (!args[0]) return message.channel.send("Escribe un parametro '`encode`, `decode`'");

    let choice = ["encode", "decode"];
    if (!choice.includes(args[0].toLowerCase())) return message.channel.send("Escribe un parametro '`encode`, `decode`'");

    let text = args.slice(1).join(" ");
    // binary <encode | decode> <text>
    // binary encode blob development

    if (!text) return message.channel.send("Escribe un texto.");

    // Do this because more than that, the binary code wouldn't be fit anymore.
    if (text.length > 1024) return message.channel.send("El texto es muy largo, el maximo es de 1024 caracteres.");

    function encode(char) {
        return char.split("").map(str => {
            const converted = str.charCodeAt(0).toString(2);
            return converted.padStart(8, "0");
        }).join(" ")
    };

    function decode(char) {
        return char.split(" ").map(str => String.fromCharCode(Number.parseInt(str, 2))).join("");
    };

    if (args[0].toLowerCase() === "encode") {
        return message.channel.send(encode(text));
    } else if (args[0].toLowerCase() === "decode") {
        return message.channel.send(decode(text));
    }
}
};