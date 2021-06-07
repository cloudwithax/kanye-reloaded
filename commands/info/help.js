const { MessageEmbed } = require("discord.js");


module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	async execute(message, args) {
		const { commands } = message.client;

		if (!args.length) {
            const embed= new MessageEmbed()
            .setTitle(`${message.client.user.username} Help Menu`)
            .setDescription(`Use ${message.client.prefix}help [command] for more info on a command.`)
            .addField('Commands', `${commands.filter(command => !command.ownerOnly).map(command => `\`${command.name}\``).join(' ')}`)
			.setColor(message.client.color);
			return await message.channel.send(embed);	
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) return await message.channel.send(`🛑 Invalid command, use \`${message.client.prefix}help\` for a valid list of commands`);
		
        const embed = new MessageEmbed()
        .setTitle(command.aliases ? `[${command.name}|${command.aliases.join('|')}]` : `${command.name}`)
        .setDescription(`${command.description}`)
        .setColor(message.client.color);

        await message.channel.send(embed);	
	},
};