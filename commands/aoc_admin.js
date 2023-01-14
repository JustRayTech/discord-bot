const { SlashCommandBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');
const accounts = require('../data/accounts');
const cooldowns = require('mongo-cooldown')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('aoc_admin')
		.setDescription('Administrative Actions')
        .addUserOption(option =>
            option.setName('user')
            .setDescription('Select an user to view their achievements')
            .setRequired(true))

        .addStringOption(option =>
            option.setName('option')
            .setDescription('Select an option.')
            .setRequired(true)
            .addChoices(
                { name: 'set Money', value: 'money' },
                { name: 'add to Inventory', value: 'inv' },
                { name: 'remove from Inventory', value: 'removeinv'},
                { name: 'reset Inventory', value: 'invreset'},
                { name: 'remove Cooldown', value: 'cooldown'}
            ))

        .addStringOption(option =>
            option.setName('var')
            .setDescription('Input corrosponding variable')
            .setRequired(true)),  


	async execute(client, interaction) {
        if (interaction.user.id != 424530206704009217) {
            return await interaction.reply("You don't have perms to use this command, L.")
        }

        var user = interaction.options.getUser('user').id
        const option = interaction.options.getString('option')
        const varia = interaction.options.getString('var')

        const dataUser = await accounts.findOne({ // Retrieve Data
            userid: user
        })

        if (!dataUser) { // Does not exist
            return await interaction.reply({content: "This person does not have an account.", empherial: true})
        }

        if (option == "inv") {
            
            dataUser.Inventory.push(varia)
            await dataUser.save()

            return await interaction.reply(`Added ${varia} to <@${user}>'s inventory`)
        }

        if (option == "removeinv") {
            dataUser.Inventory.splice(dataUser.Inventory.indexOf(varia))
            await dataUser.save()
            return await interaction.reply(`Removed ${varia} from <@${user}>'s inventory`)
        }

        if (option == "invreset") {
            dataUser.Inventory = []
            await dataUser.save()
            return await interaction.reply(`<@${user}>'s inventory has been purged. o7`)
        }

        if (option == "cooldown") {
           
            cooldowns.removeCoolDown(user, varia)
            return await interaction.reply(`<@${user}>'s cooldown for the command /${varia} has been removed.`)
        }

       //
    }
}