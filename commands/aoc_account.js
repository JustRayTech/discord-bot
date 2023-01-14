const { SlashCommandBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');
const accounts = require('../data/accounts');
const aoc_adventure = require('./aoc_adventure');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('aoc_account')
		.setDescription('Reset, delete or create an account for Ascension of Conflict.')
        .addStringOption(option =>
            option.setName('option')
            .setDescription('Select an option.')
            .setRequired(true)
            .addChoices(
                { name: 'Delete your account', value: 'delete' },
                { name: 'Reset your account', value: 'reset' },
                { name: 'Register', value: 'register' },
                { name: 'Stats', value: 'stats'}
            ))
        .addUserOption(option =>
            option.setName('user')
            .setDescription('Select an user to view their stats')),
        

	async execute(client, interaction) {
		const option = interaction.options.getString('option')

        if (option == "register") {
            const dataUser = await accounts.findOne({
                userid: interaction.member.id
            })
        


            if (!dataUser) { // Does not exist
                const strengthroll = Math.floor(Math.random() * 6)
                const defenseroll = Math.floor(Math.random() * 6)
                const agilityroll = Math.floor(Math.random() * 11)
                const dataUser = new accounts({
                    userid: interaction.member.id,
                    Strength: strengthroll, 
                    Defense: defenseroll,
                    Agility: agilityroll,
                    Magic: 0,
                    Money: 500,
                    Achievements: [],
					Inventory: [],
                    Slaves: {},
                })

                const stats = new EmbedBuilder()
                .setAuthor({name: `${interaction.member.user.tag} - Account aangemaakt`, iconURL: interaction.member.user.avatarURL()})
                .setColor('Green')
                .setDescription(`⚔️ — Strength: ${strengthroll}\n🛡️ — Defense: ${defenseroll}\n🏃 — Agility: ${agilityroll}`)
                

                await dataUser.save()
                await interaction.reply({embeds: [stats]})

            }else{ // Already exists
              await interaction.reply("You are already registed.")
            }
        }else if (option == "stats") {
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

            const rayUser = await accounts.findOne({
                userid: '424530206704009217'
            })

            if (dataUser.Strength > 100) {
                dataUser.Strength = 100
            }

            if (dataUser.Strength < 0) {
                dataUser.Strength = 0
            }

            if (dataUser.Defense > 100) {
                dataUser.Defense = 100
            }

            if (dataUser.Defense < 0) {
                dataUser.Defense = 0
            }

            if (dataUser.Agility > 100) {
                dataUser.Agility = 100
            }

            if (dataUser.Agility < 0) {
                dataUser.Agility = 0
            }

            if (dataUser.Money < 0) {
                dataUser.Money = 0
            }

            await dataUser.save()


            const stats = new EmbedBuilder()
            .setAuthor({name: `${user.username}'s fighter stats`, iconURL: user.avatarURL()})
            .setColor('DarkButNotBlack')
            .addFields(
                { name: `⚔️ Strength`, value: `${dataUser.Strength}/100`, inline: true },
                { name: '🛡️ Defense', value: `${dataUser.Defense}/100`, inline: true },
                { name: `🏃 Agility`, value: `${dataUser.Agility}/100 `, inline: true },
                { name: '🪄 Magic', value: `${dataUser.Magic}/100 `, inline: true },
                { name: '📜 Achievm.', value: `${dataUser.Achievements.length}/${rayUser.Achievements.length} `, inline: true },
                { name: '💰 Balance', value: `${dataUser.Money} ⏣`, inline: true },
            )

            await interaction.reply({embeds: [stats]})
        }

	},
};