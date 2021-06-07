const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'nowplaying',
    description: 'Shows the currently playing track',
    aliases: ['np', 'current'],
    async execute(message, args) {
        if (!message.member.voice.channel) return message.channel.send('🛑 You must be in a channel first!').then(msg => msg.delete({ timeout: 5000 }));
        if (!message.guild.me.voice.connection) return message.channel.send("🛑 I'm not in a voice channel!").then(msg => msg.delete({ timeout: 5000 }));
        if (message.member.voice.channel != message.guild.me.voice.connection.channel) return message.channel.send("🛑 You must be in the same channel as the bot in order to do that!").then(msg => msg.delete({ timeout: 5000 }));
        const embed = new MessageEmbed()
        .setTitle('Now Playing')
        .setDescription(`${message.client.current}`)
        .setColor(message.client.color)
        .setFooter(`Use ${message.client.prefix}help for more commands!`, `${message.client.user.avatarURL()}`);
        message.channel.send(embed).then(msg => msg.delete({ timeout: 15000 }));
    }
}