const discord = require('discord.js');

module.exports = {
    name: 'invite',
    aliases: ['inv'],
    description: 'Sends the bots invite link',
    async execute(message, args) {
        const embed = new discord.MessageEmbed()
        .setTitle('Invite me')
        .setURL('https://discord.com/api/oauth2/authorize?client_id=821007014536019999&permissions=36719680&scope=bot')
        .setColor(message.client.color);
        await message.channel.send(embed)
    }
}