const discord = require('discord.js');
const osutils = require('node-os-utils');
const humanizeDuration = require('humanize-duration')

module.exports = {
    name: 'about',
    aliases: ['ab'],
    description: 'Shows more info about the bot',
    async execute(message, args) {
        const meminfo = await osutils.mem.info();
        const cpu = await osutils.cpu.usage();
        const embed = new discord.MessageEmbed()   
        .setTitle('About')
        .addField('Name', `${message.client.user.tag}`, true)
        .addField('Servers', `${message.client.guilds.cache.size}`, true)
        .addField('Members', `${message.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}`, true)
        .addField('Owner', 'Clxud#6951', true)
        .addField('Commands', `${message.client.commands.size}`, true)
        .addField('Uptime', `\`${humanizeDuration(Date.now() - message.client.start_time)}\``, true)
        .addField('Current Prefix', `\`${message.client.prefix}\``, true)
        .addField('CPU', `${cpu}%`, true)
        .addField('Memory', `${Math.round(meminfo.usedMemMb)} MB / ${Math.round(meminfo.totalMemMb)} MB`, true)
        .setColor(message.client.color)
        .setThumbnail(`${message.client.user.avatarURL()}`)
        .setFooter(`Use ${message.client.prefix}help for more commands!`, `${message.client.user.avatarURL()}`);
        await message.channel.send(embed);
    }
}