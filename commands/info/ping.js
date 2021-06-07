const discord = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Sends the bots latency',
    async execute(message, args) {
        const embed = new discord.MessageEmbed()
        .setTitle(`${Math.round(message.client.ws.ping)}ms`)
        .setColor(message.client.color);
        await message.channel.send(embed)
    }
}