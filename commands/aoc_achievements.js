const { SlashCommandBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');
const accounts = require('../data/accounts');
const cooldowns = require('mongo-cooldown')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('aoc_achievements')
		.setDescription('View your or someone else their achievements.')
        .addUserOption(option =>
            option.setName('user')
            .setDescription('Select an user to view their achievements')),


	async execute(client, interaction) {
        var user = interaction.options.getUser('user')
        var userid = "err"
        if (!user) {
            user = interaction.user
            userid = interaction.member.id
        }else{
            userid = user.id
        }

        const dataUser = await accounts.findOne({ // Retrieve Data
            userid: userid
        })

        if (!dataUser) { // Does not exist
            return await interaction.reply({content: "This person does not have an account.", empherial: true})
        }

        const userInventory = dataUser.Achievements
        var inventoryList = "Something went wrong!"

        if (userInventory.length < 1) {
            inventoryList = "This person has no achievements."
        }else{

            inventoryList = Object.entries(
                userInventory.reduce((res, item) => ({...res, [item]: (res[item] || 0) + 1}), {})
                ).map(([name, count]) => `— ${name}`).join('\n')
        }

            
            const inv = new EmbedBuilder()
            .setAuthor({name: `${user.username}'s achievements`, iconURL: user.avatarURL()})
            .setDescription(inventoryList)

            
            await interaction.reply({embeds: [inv]})

    }
}