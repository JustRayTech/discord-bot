const { Client, GatewayIntentBits, Routes, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityType } = require("discord.js");
const botConfig = require("./botconfig.json");
const fs = require("node:fs");
const path = require('node:path');
const { REST } = require("@discordjs/rest");
const { cp } = require("node:fs");
const client = new Client({intents: [GatewayIntentBits.Guilds]});

module.exports = client


const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://ray:test@cluster0.o5utrn3.mongodb.net/test')

fs.readdir('./functions', (err, files) => {
	if (err) {
	  console.error(err);
	  return;
	}
  
	// iterate over the array of file names
	files.forEach((file) => {
	  // require the file
	  require('./functions/' + file)
	  console.log(`✅  — Module ${file} has loaded successfully.`)
	});

	console.log(`✅  — All modules loaded successfully`)
    console.clear()


})

client.commands = new Collection();
var commands = [];
var reload = false

client.once("ready", () => {

    console.log(`✅  — JustBot is online! (${botConfig.version})`)


    let guildId = botConfig.guildID;
    let clientId = botConfig.clientID;
    let token = botConfig.token;

    const rest = new REST({version: 10}).setToken(token);

	client.user.setActivity(`on version: ${botConfig.version}`, { type: ActivityType.Playing });

    rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('✅  — Successfully registered application commands.'))
	.catch(console.error);

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

	const onEmbed = new EmbedBuilder()
	.setDescription(`<:yes:1050802599818969158> — **Bot online!**`)
	.setColor('Green')

	const channel = client.channels.cache.find(channel => channel.name === "ascension-of-conflict")
	channel.send({embeds: [onEmbed]})


});

async function loadCommands(client) {
	await client.commands.clear()
	commands = []

	const commandsPath = path.join(__dirname, 'commands');
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	
	console.clear()

	console.log(`Loading command files...`)
	console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
	
		client.commands.set(command.data.name, command);
		commands.push(command.data.toJSON());
	
		console.log(`✅ - The file ${command.data.name}.js has loaded successfully`)
	}	

	 
	if (reload == true) {
		console.log('✅  — All files have been reloaded successfully.')
	}else{
		console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
		console.log('✅  — All commands loaded successfully!')
	}

	console.clear()
}

loadCommands(client)


client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(client, interaction);
	} catch (error) {
        console.log(error)
		const errore = new EmbedBuilder()
		.setDescription(`<:warn:1050802602566234202> **An error occured!**\n${error}`)
		.setColor('Red')
		await interaction.reply({ content: `<@424530206704009217>`, embeds: [errore]});
	}
});


client.on('interactionCreate', async interaction => {
	if (!interaction.isContextMenuCommand()) return;
	const command = client.commands.get(interaction.commandName);
	if (!command) return;

	try {
		await command.execute(client, interaction);
	} catch (error) {
        console.log(error)
		const errore = new EmbedBuilder()
		.setDescription(`<:warn:1050802602566234202> **An error occured!**\n${error}`)
		.setColor('Red')
		await interaction.reply({ content: `<@424530206704009217>`, embeds: [errore]});
	}
});

client.login(botConfig.token)




