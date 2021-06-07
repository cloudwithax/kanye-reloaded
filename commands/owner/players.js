const { MessageEmbed } = require('discord.js');
const rm = require('discord.js-reaction-menu')

module.exports = {
    name: 'players',
    description: 'Shows all active players',
    ownerOnly: true,
    async execute(message, args) {
        const pages = [];
        const array_chunks = (array, chunk_size) => Array(Math.ceil(array.length / chunk_size)).fill().map((_, index) => index * chunk_size).map(begin => array.slice(begin, begin + chunk_size));
        const chunked = array_chunks(message.client.players.map(player => player), message.client.players.size >= 10 ? 10 : message.client.players.size);
        chunked.forEach(items => {
            const description = [];
            items.forEach(player => description.push(`${player.channel.guild.name} - [\`${player.channel.guild.id}\`]`));
            const embed = new MessageEmbed({title: `Active Players (${message.client.players.size} total)`, description: description.join('\n'), color: message.client.color, footer: {text: `Page ${pages.length + 1}/${chunked.length} | Use ${message.client.prefix}help for more commands!`, iconURL: `${message.client.user.avatarURL()}`}});
            pages.push(embed);
        });
        new rm.menu({
            channel: message.channel,
            userID: message.author.id,
            pages: pages
        });
    }
}