module.exports = {
    name: 'leave',
    description: 'Disconnects the player from the channel',
    aliases: ['disconnect', 'dc', 'disc', 'lv', 'fuckoff'],
    async execute(message, args) {
        if (!message.member.voice.channel) return message.channel.send('🛑 You must be in a channel first!').then(msg => msg.delete({ timeout: 5000 }));
        if (!message.guild.me.voice.connection) return message.channel.send("🛑 I'm not in a voice channel!").then(msg => msg.delete({ timeout: 5000 }));
        if (message.member.voice.channel != message.guild.me.voice.connection.channel) return message.channel.send("🛑 You must be in the same channel as the bot in order to do that!").then(msg => msg.delete({ timeout: 5000 }));
        const player = message.client.players.get(message.guild.id);
        player.maybe_disconnect = true;
        player.voice.disconnect();
        await player.controller.delete();
        message.client.players.delete(message.guild.id);
        await message.react('👋');


    }
}