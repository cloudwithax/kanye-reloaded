const fs = require('fs');

module.exports = {
	name: 'reload',
    aliases: ['rl'],
	description: 'Reloads a command',
	args: true,
    ownerOnly: true,
	async execute(message, args) {
        if (!args.length) return await message.channel.send('🛑 Hey stupid, you need to enter a command to reload...')
		const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) return await message.channel.send(`🛑 Hey stupid, that's not a command...`);
		
		const commandFolders = fs.readdirSync('./commands');
		const folderName = commandFolders.find(folder => fs.readdirSync(`./commands/${folder}`).includes(`${command.name}.js`));

		delete require.cache[require.resolve(`../${folderName}/${command.name}.js`)];

		try {
			const newCommand = require(`../${folderName}/${command.name}.js`);
			message.client.commands.set(newCommand.name, newCommand);
			await message.channel.send(`✅ Command \`${newCommand.name}\` reloaded.`);
		} catch (error) {
			console.error(error);
			await message.channel.send(`🛑 There was an error reloading command \`${command.name}\`:\n\`${error.message}\``);
		}
	},
};