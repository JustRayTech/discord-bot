const { SlashCommandBuilder, TextInputStyle, EmbedBuilder, messageLink } = require('discord.js');
const accounts = require('../data/accounts');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('aoc_use')
		.setDescription('Use an item.')
        .addStringOption(option =>
            option.setName('item')
            .setDescription('Select an item to use.')
            .setRequired(true))
        .addNumberOption(option =>
            option.setName('number')
            .setDescription('How many times do you want to use this item?')                
            .setRequired(true)
                ),

	async execute(client, interaction) {
        const dataUser = await accounts.findOne({ // Check if they have an account
            userid: interaction.member.id
        })
    
        if (!dataUser) { // Does not exist
            return await interaction.reply({content: "You haven't registered an account yet, you can do so by using `/aoc_account register`", empherial: true})
        }

		const item = interaction.options.getString('item')
        const itemAmount = interaction.options.getNumber('number')

        
        if (!dataUser.Inventory.includes(item)) {
            return await interaction.reply({content: "You don't own this item?", empherial: true})
        }

        if (item == "Magic Spell") {

            let inventory = dataUser.Inventory
            let count = inventory.filter(element => element === "Magic Spell").length;

            if (count > itemAmount) {
                return await interaction.reply({content: `You wanted to use **${itemAmount}** ${item}'s but you only have **${count}**`})
            }


            
            const useEmbed = new EmbedBuilder()
            .setAuthor({name: `${interaction.member.user.tag} - Used an item`, iconURL: interaction.member.user.avatarURL()})
            .setColor("Green")
            .setDescription(`You carefully studied your **${count}x Magic Spell**, and earned **${count * 2}** magic points!`)

            dataUser.Magic = dataUser.Magic + (2 * count)
            
            let index = dataUser.Inventory.indexOf("Magic Spell")
            dataUser.Inventory.splice(index, count)

            await dataUser.save()
            return await interaction.reply({embeds: [useEmbed]})

        } else if (item == "Sex Doll" || item == "Pink Phallic Object" || item == "Black Phallic Object") {
            const useEmbed = new EmbedBuilder()
            .setAuthor({name: `${interaction.member.user.tag} - Used an item`, iconURL: interaction.member.user.avatarURL()})
            .setColor("Green")
            .setDescription(`You used your ${item}.. wtf..?`)

            const failEmbed = new EmbedBuilder()
            .setAuthor({name: `${interaction.member.user.tag} - Tried to use an item`, iconURL: interaction.member.user.avatarURL()})
            .setColor("Red")
            .setDescription(`You tried to use your ${item} but it looks like it didn't fit.. Perhaps you can try again later?`)

            if (Math.random() < 0.5) {
                return await interaction.reply({embeds: [failEmbed]})

            }else{
                return await interaction.reply({embeds: [useEmbed]})
            }
        }else{
            return await interaction.reply({content: "This item can't be used.", empherial: true})
        }

	},
};