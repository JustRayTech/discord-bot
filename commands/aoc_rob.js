const { SlashCommandBuilder, TextInputStyle, EmbedBuilder, messageLink, ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const accounts = require('../data/accounts');
const cooldowns = require('mongo-cooldown')

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('aoc_rob')
		.setType(ApplicationCommandType.User),

	async execute(client, interaction) {
        const option = interaction.targetUser

        const dataUser = await accounts.findOne({ // Check if they have an account
            userid: interaction.member.id
        })
    
        const dataUser2 = await accounts.findOne({ // Check if they have an account
            userid: option.id
        })

        if (!dataUser) { // Does not exist
            return await interaction.reply({content: "You haven't registered an account yet, you can do so by using `/aoc_account register`", empherial: true})
        }

        if (!dataUser2) { // Does not exist
            return await interaction.reply({content: "That person doesn't have an account!", empherial: true})
        }

        if (dataUser.Money < 50) {
            return await interaction.reply("You do not have enough money to rob someone.")
        }

        if (dataUser2.Money < 50) {
            return await interaction.reply("This person is poor, lmfao!")
        }

        		// COOLDOWN
		var cooldownTime = 60*60*4 // SECONDS
		const commandName = "aoc_rob"
		cooldownTime = cooldownTime * 1000
		let cooldown = await cooldowns.checkCoolDown(interaction.member.id, commandName)
		if (cooldown.ready == true) {
			let cooldown = await cooldowns.addCoolDown(interaction.member.id, cooldownTime, commandName)
		}else{
			return await interaction.reply({ content: `**You have been rate-limited!**\nYou can use **'/${cooldown.command}'** again <t:${Math.round((Date.now() + cooldown.time) / 1000)}:R>`, ephemeral: true})	
		}
		// END COOLDOWN

        const stolenMoney = Math.floor(Math.random() * (dataUser2.Money / 2))
        const fine = Math.floor(Math.random() * (dataUser.Money / 4))
        const moneyToOTher = Math.floor(Math.random() * (dataUser.Money / 4))

        const winChance = Math.random()

        if (winChance < 0.5) {
            if (!dataUser.Achievements.includes("Caught!")) {
                dataUser.Achievements.push("Caught!")
                const fail = new EmbedBuilder()
                .setAuthor({name: `${interaction.member.user.tag} - Achievement Unlocked!`, iconURL: interaction.member.user.avatarURL()})
                .setColor('Gold')
                .setTitle('Caught!')
                .setDescription("Get caught trying to rob someone!")
                
                setTimeout(function() {
                    interaction.channel.send({embeds: [fail]})
                }, 100)
    
            }


            const embed = new EmbedBuilder()
            .setAuthor({name: `${interaction.member.user.tag} - Failed to rob someone!`, iconURL: interaction.member.user.avatarURL()})
            .setColor('Red')
            .setDescription(`You got caught trying to rob ${option} and you paid a fine of **${fine} ⏣** aswell as **${moneyToOTher} ⏣** in damages to the victim.`)
            dataUser.Money = dataUser.Money - (fine + moneyToOTher)
            dataUser2.Money = dataUser2.Money + moneyToOTher
            dataUser.save()
            dataUser2.save()

            return await interaction.reply({embeds: [embed]})

            
        }else{
            if (!dataUser.Achievements.includes("Professional Pickpocketer!")) {
                dataUser.Achievements.push("Professional Pickpocketer!")
                const fail = new EmbedBuilder()
                .setAuthor({name: `${interaction.member.user.tag} - Achievement Unlocked!`, iconURL: interaction.member.user.avatarURL()})
                .setColor('Gold')
                .setTitle('Professional Pickpocketer!')
                .setDescription("Successfully rob someone of their money!")
                
                setTimeout(function() {
                    interaction.channel.send({embeds: [fail]})
                }, 100)
    
            }


            const embed = new EmbedBuilder()
            .setAuthor({name: `${interaction.member.user.tag} - Robbed someone!`, iconURL: interaction.member.user.avatarURL()})
            .setColor('Green')
            .setDescription(`You robbed ${option} and stole **${stolenMoney} ⏣** from them!`)

            dataUser.Money = dataUser.Money + stolenMoney
            dataUser2.Money = dataUser2.Money - stolenMoney
            dataUser.save()
            dataUser2.save()
            return await interaction.reply({embeds: [embed]})
        }



	},
};