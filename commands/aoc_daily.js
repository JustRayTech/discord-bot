const { SlashCommandBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ModalSubmitFields } = require('discord.js');
const cooldowns = require('mongo-cooldown')
const accounts = require('../data/accounts');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('aoc_daily')
		.setDescription('Daily reward'),


	async execute(client, interaction) {
		
		// COOLDOWN
		var cooldownTime = 60*60*24 // SECONDS
		const commandName = "daily"
		cooldownTime = cooldownTime * 1000
		let cooldown = await cooldowns.checkCoolDown(interaction.member.id, commandName)
		if (cooldown.ready == true) {
			let cooldown = await cooldowns.addCoolDown(interaction.member.id, cooldownTime, commandName)
		}else{
			return await interaction.reply({ content: `**You have been rate-limited!**\nYou can use **'/${cooldown.command}'** again <t:${Math.round((Date.now() + cooldown.time) / 1000)}:R>`, ephemeral: true})	
		}
		// END COOLDOWN


		const rewardsPool = ["Monster"]
		const rndmchoice = rewardsPool[Math.floor(Math.random()*rewardsPool.length)];

        let dataUser = await accounts.findOne({ // Retrieve Data
            userid: interaction.user.id
        })

	
		if (!dataUser) { // Does not exist
			return await interaction.reply({content: "You haven't registered an account yet, you can do so by using `/aoc_account register`", empherial: true})
		}

		if (rndmchoice == "Money") {

		}else if (rndmchoice == "Item") {

		}else{


		const monsterEcounter = require('../functions/monster_enc')
		
		interaction.reply("Searching for a monster..")
		await monsterEcounter(interaction.user, interaction.channel)
		interaction.deleteReply()
		}
		}

	};