const { SlashCommandBuilder, TextInputStyle } = require('discord.js');
//test
module.exports = {
	data: new SlashCommandBuilder()
		.setName('rps_bot')
		.setDescription('Play rock paper scissors with me.')
		
		.addStringOption(option =>
			option.setName('choice')
				.setDescription('Select your choice')
				.setRequired(true)
				.addChoices(
					{ name: 'stone', value: 'choice_stone' },
					{ name: 'paper', value: 'choice_paper' },
					{ name: 'scissors', value: 'choice_scissors' },
				)),


	async execute(client, interaction) {
		const choice = interaction.options.getString('choice')

		if (choice == "choice_stone") {
			const botChoice = Math.floor(Math.random() * 3);

			if (botChoice == 0) {
				await interaction.reply("You chose **stone** and I chose **scissors**. You win.");
			}else if (botChoice == 1) {
				await interaction.reply("You chose **stone** and I chose ook **stone**. It's a draw.");
			}else if (botChoice == 2) {
				await interaction.reply("You chose **stone** and I chose **paper**. I win.");
			}

		}else if (choice == "choice_paper") {
			const botChoice = Math.floor(Math.random() * 3);

			if (botChoice == 0) {
				await interaction.reply("You chose **paper** and I chose **scissors**. I win.");
			}else if (botChoice == 1) {
				await interaction.reply("You chose **paper** and I chose ook **paper**. It's a draw.");
			}else if (botChoice == 2) {
				await interaction.reply("You chose **paper** and I chose **stone**. You win.");
			}
		
		}else if (choice == "choice_scissors") {
			const botChoice = Math.floor(Math.random() * 3);

			if (botChoice == 0) {
				await interaction.reply("You chose **scissorsand I choseoos **scissors**. It's a draw.");
			}else if (botChoice == 1) {
				await interaction.reply("You chose **scissorsand I choseoos **paper**. You win.");
			}else if (botChoice == 2) {
				await interaction.reply("You chose **scissorsand I choseoos **stone**. I win.");
			}
		}





	},
};