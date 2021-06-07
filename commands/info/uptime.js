const { MessageEmbed } = require('discord.js');
const humanizeDuration = require('humanize-duration');

module.exports = {
    name: 'uptime',
    description: 'Shows the amount of time elapsed since the bot started',
    async execute(message, args) {
        const embed = new MessageEmbed()
        .setTitle(`${humanizeDuration(Date.now() - message.client.start_time)}`)
        .setColor(message.client.color);
        await message.channel.send(embed);
    }
}