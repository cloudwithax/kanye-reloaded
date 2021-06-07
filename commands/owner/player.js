const { MessageEmbed } = require("discord.js");
const humanizeDuration = require('humanize-duration');

module.exports = {
    name: 'player',
    description: 'Commands for player features',
    ownerOnly: true,
    async execute(message, args) {
        if (!args.length) {
            const embed = new MessageEmbed()
            .setTitle('player')
            .setDescription('Commands for player features')
            .addField('player info <guildid>', 'Sends useful info of a player using its associated guild ID')
            .addField('player stop <guildid>', 'Destroys a player instance using its associated guild ID')
            .setColor(message.client.color)
            .setFooter(`Use ${message.client.prefix}help for more commands!`, `${message.client.user.avatarURL()}`);
            return await message.channel.send(embed);
        }

        if (!args[1]) return message.channel.send("🛑 You must specify a guild ID!").then(msg => msg.delete({ timeout: 5000 }));
        const player = message.client.players.get(args[1])
        if (!player) return message.channel.send("🛑 That player doesn't exist!").then(msg => msg.delete({ timeout: 5000 }));

        switch (args[0]) {
            case "info":  
                const embed = new MessageEmbed()
                .setTitle(`Player Info (${player.message.guild.name})`)
                .addField('Channel ID', `${player.voice.channel.id}`)
                .addField('Now Playing', `${message.client.current}`)
                .addField('DJ', `${player.dj.tag}`)
                .addField('Duration', `${humanizeDuration(Date.now() - player.joined_at)}`)
                .setColor(message.client.color)
                .setFooter(`Use ${message.client.prefix}help for more commands!`, `${message.client.user.avatarURL()}`);
                await message.channel.send(embed);
                break;
            case 'reset':
            case 'stop':
                player.maybe_disconnect = true;
                player.voice.disconnect()
                await player.controller.delete()
                await player.channel.send(`⚠️ <@${player.dj.id}>, the player is being manually reset by the owner. You can use \`${message.client.prefix}join\` to rejoin the bot.`)
                await message.channel.send(`✅ Sucessfully destroyed player in guild ${player.message.guild.id}`)
                message.client.players.delete(player.message.guild.id)
                break;

        }
    }
}