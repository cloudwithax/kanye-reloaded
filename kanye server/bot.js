const discord = require('discord.js');
const fs = require('fs');
const process = require('process');
const { AutoPoster } = require('topgg-autoposter')

const client = new discord.Client({presence: {status: 'online', activity: {type: 'LISTENING', name: 'kanye help | v2.1'}}});
client.commands = new discord.Collection();
client.color = (0x70e1df);
client.start_time = Date.now()
client.prefix = "kanye ";
client.players = new discord.Collection();
client.broadcast = client.voice.createBroadcast()

const folders = fs.readdirSync('./commands')
const poster = AutoPoster('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgyMTAwNzAxNDUzNjAxOTk5OSIsImJvdCI6dHJ1ZSwiaWF0IjoxNjIwMDc0MzUzfQ.iCrq7Akpm5_xEXsaddgxzRuOEK_TLh4L2wPf3OmaUqs', client)

for (const folder of folders) {
    const files = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of files) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}

async function play() {
    const songs = fs.readdirSync('./songs');
    const index = Math.floor(Math.random() * songs.length);
    const song = songs[index];
    client.current = song.slice(0, -4);

    const embed = new discord.MessageEmbed()
        .setTitle('Now Playing')
        .setDescription(`${client.current}`)
        .setColor(client.color)
        .setFooter(`Use ${client.prefix}help for more commands!`, `${client.user.avatarURL()}`);

    if (client.players.size > 0) {
        client.players.each(async player => player.controller = await player.channel.send(embed))
    }
    

    client.broadcast.play(`./songs/${song}`)
    .on('finish', async () => {
        if (client.players.size > 0) {
            client.players.each(async player => await player.controller.delete())
        }
        await play();
    });
}




client.on('ready', async () => {
    console.log(`${client.user.tag} is online and serving ${client.guilds.cache.size} guilds`);
    await play(); 
});



client.on('message', async message => {
    if (!message.content.startsWith(client.prefix) || message.author.bot) return;

    const args = message.content.slice(client.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;
    if (command.ownerOnly && message.author.id != '313314995687391234') return;


    try {
        await command.execute(message, args);
    } catch(error) {
        console.error(error);
        await message.channel.send('🛑 An unexpected error occurred while executing the command! Please report this to the owner. \n```' + error + '```')

    }

});

client.on('guildCreate', async guild => {
   
    let channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))     
    const embed = new discord.MessageEmbed()
    .setTitle('Thank you for inviting Kanye Reloaded!')
    .setDescription('You can start playing Kanye music by typing **kanye join** while in a voice channel. \n\nDo **kanye help** for more information on how to do any commands\n\n If you have any issues/question, feel free to join our [support server](https://discord.gg/bBeAQcftAr)')
    .setColor(client.color)
    .setFooter(`Use ${client.prefix}help for more commands!`, `${client.user.avatarURL()}`);
    await channel.send(embed);
             
    channel = await client.channels.fetch('799402132105068545')
    await channel.send(`<@313314995687391234>, I was added to **${guild.name}**! I'm now in **${client.guilds.cache.size}** guilds.`)

});

client.on('guildDelete', async guild => {
    const channel = await client.channels.fetch('799402132105068545')
    await channel.send(`<@313314995687391234>, I was removed from **${guild.name}**. I'm now in **${client.guilds.cache.size}** guilds.`)
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    if (newState.member === newState.guild.me && !newState.connection && !client.players.get(oldState.guild.id).maybe_disconnect) {
        const player = client.players.get(oldState.guild.id);
        console.log('Detected forced disconnect, cleaning up...');
        try {
            await player.controller.delete();
        } catch (err) {}
        client.players.delete(player.message.guild.id);
    }
})

process.on('SIGINT', async () => {
    if (client.players.size > 0) {
        for (const player of client.players.values()) {
            player.maybe_disconnect = true;
            player.voice.disconnect();
            await player.controller.delete();
            await player.channel.send(`⚠️ <@${player.dj.id}>, the bot is being manually restarted by the owner. Once the bot has restarted, you can use \`${client.prefix}join\` to rejoin the bot.`);
            client.players.delete(player.message.guild.id);
        }
          
    }
    console.log('Shutting down now...');
    process.exit();
});

client.login('ODIxMDA3MDE0NTM2MDE5OTk5.YE9cXQ.s3V7CkhpOhGAXG7xSupi-FtoANU');

