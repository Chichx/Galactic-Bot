module.exports = {
  canModifyQueue(member) {
    const { channel } = member.voice;
    const botChannel = member.guild.me.voice.channel;

    if (channel !== botChannel) {
      member.send("Primero tienes que entrar a un canal de voz!").catch(console.error);
      return false;
    }

    return true;
  }
};
