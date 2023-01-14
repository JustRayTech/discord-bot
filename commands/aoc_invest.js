const { SlashCommandBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ModalSubmitFields } = require('discord.js');
const cooldowns = require('mongo-cooldown')
const accounts = require('../data/accounts');
const stocks = require('../data/stocks');
const stocksPrices = require('../data/stockPrices');



module.exports = {
	data: new SlashCommandBuilder()
		.setName('aoc_invest')
		.setDescription('Invest your money!')
        .addStringOption(option =>
            option.setName('company')
            .setDescription('Select a company to invest')
            .setRequired(true)
            .addChoices(
                { name: 'Pear Electronics', value: 'com1' },
                { name: 'RaceX', value: 'com2' },
            ))
        .addStringOption(option =>
                option.setName('option')
                .setDescription('Select an option')
                .setRequired(true)
                .addChoices(
                    { name: 'Information', value: 'info' },
                    { name: 'Buy stock', value: 'invest' },
                    { name: 'Sell stock', value: 'sell' },
            )),


	async execute(client, interaction) {
        let dataUser = await accounts.findOne({ // Retrieve Data
            userid: interaction.user.id
        })

		let dataStocks = await accounts.findOne({ // Retrieve Data
            userid: interaction.user.id
        })

		if (!dataUser) { // Does not exist
			return await interaction.reply({content: "You haven't registered an account yet, you can do so by using `/aoc_account register`", empherial: true})
		}




	}
};