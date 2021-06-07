const { MessageEmbed } = require("discord.js");

class Player {
    constructor(message) {
        this.message = message;
        this.channel = message.channel;
        this.voice = message.guild.me.voice.connection;
        this.dj = message.author;
        this.joined_at = Date.now()
        this.controller;
        this.maybe_disconnect = false;
    }
}

module.exports = {
    name: 'join',
    aliases: ['join', 'joi', 'j', 'summon', 'su', 'con'],
    description: 'Connect to a voice channel and plays Kanye music.',
    async execute(message, args) {
        if (!message.member.voice.channel) return message.channel.send('🛑 You must be in a channel first!').then(msg => msg.delete({ timeout: 5000 }));

        const perms = message.member.voice.channel.permissionsFor(message.guild.me)
        if (!perms.has('CONNECT') || !perms.has('SPEAK')) return message.channel.send("🛑 I'm not allowed to enter your channel!").then(msg => msg.delete({ timeout: 5000 }));

        if (message.guild.me.voice.connection) {
            if (message.guild.me.voice.connection.dispatcher && message.member.voice.channel != message.guild.me.voice.connection.channel) {
                return message.channel.send("🛑 You can't move the bot while it's playing in another channel!").then(msg => msg.delete({ timeout: 5000 }));
            }
            if (message.member.voice.channel === message.guild.me.voice.connection.channel) {
                return message.channel.send("🛑 I'm already in this channel!").then(msg => msg.delete({ timeout: 5000 }))
            }
        }

        const connection = await message.member.voice.channel.join()
        await message.guild.me.voice.setSelfDeaf(true);
        await message.react('✅');
        const player = new Player(message);
        message.client.players.set(message.guild.id, player)
        connection.play(message.client.broadcast);
        const embed = new MessageEmbed()
        .setTitle('Now playing')
        .setDescription(`${message.client.current}`)
        .setColor(message.client.color)
        .setFooter(`Use ${message.client.prefix}help for more commands!`, `${message.client.user.avatarURL()}`);
        player.controller = await message.channel.send(embed);
        

    }
}