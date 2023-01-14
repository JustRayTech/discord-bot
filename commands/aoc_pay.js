const { SlashCommandBuilder, TextInputStyle, EmbedBuilder, messageLink } = require('discord.js');
const accounts = require('../data/accounts');
const cooldowns = require('mongo-cooldown')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('aoc_pay')
		.setDescription('Give someone money.')
        .addUserOption(option =>
            option.setName('option')
            .setDescription('What user?')
            .setRequired(true))
        .addNumberOption(option =>
            option.setName('amount')
            .setDescription('Amount you wish to give?')
            .setRequired(true)
        ),

	async execute(client, interaction) {
        const option = interaction.options.getUser('option')
        const amount = interaction.options.getNumber('amount')

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


	

        if (amount > 1000) {
            return await interaction.reply("You can't give more than **1000$**")
        }

        
        if (amount < 50) {
            return await interaction.reply("You need to give more than **50$**")
        }

      
        if (dataUser.Money < amount ) {
            return await interaction.reply("You dont have enough money for this!")
        }

        if (!dataUser.Achievements.includes("Giving to the poor")) {
            dataUser.Achievements.push("Giving to the poor")
            const fail = new EmbedBuilder()
            .setAuthor({name: `${interaction.member.user.tag} - Achievement Unlocked!`, iconURL: interaction.member.user.avatarURL()})
            .setColor('Gold')
            .setTitle('Giving to the poor')
            .setDescription("Give a poor person some money!")
            
            setTimeout(function() {
                interaction.channel.send({embeds: [fail]})
            }, 100)

        }

                dataUser.Money = dataUser.Money - amount
                dataUser2.Money = dataUser2.Money + amount
                dataUser.save()
                dataUser2.save()
                return await interaction.reply(`Successfully gave ${option} **${amount}$**`)
	},
};