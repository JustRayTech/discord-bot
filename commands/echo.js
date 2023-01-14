const { SlashCommandBuilder, TextInputStyle } = require('discord.js');
const cooldowns = require('mongo-cooldown')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('echo')
		.setDescription('Echos back a message.')
		
		.addStringOption(option =>
			option.setName('message')
				.setDescription('What message?')
				.setRequired(true)),


	async execute(client, interaction) {
		
		// COOLDOWN
		var cooldownTime = 60 // SECONDS
		const commandName = "echo"
		cooldownTime = cooldownTime * 1000
		let cooldown = await cooldowns.checkCoolDown(interaction.member.id, commandName)
		if (cooldown.ready == true) {
			let cooldown = await cooldowns.addCoolDown(interaction.member.id, cooldownTime, commandName)
		}else{
			return await interaction.reply({ content: `**You have been rate-limited!**\nYou can use **'/${cooldown.command}'** again <t:${Math.round((Date.now() + cooldown.time) / 1000)}:R>`, ephemeral: true})	
		}
		// END COOLDOWN


		await interaction.reply({ content: interaction.options.getString('messageeeeeee'), ephemeral: false });
	},
};