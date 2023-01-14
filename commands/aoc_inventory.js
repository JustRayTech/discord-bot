const { SlashCommandBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');
const accounts = require('../data/accounts');
const cooldowns = require('mongo-cooldown')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('aoc_inventory')
		.setDescription('View your or someone else their inventory.')
        .addUserOption(option =>
            option.setName('user')
            .setDescription('Select an user to view their inventory')),


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

        const userInventory = dataUser.Inventory
        var inventoryList = "Something went wrong!"

        if (userInventory.length < 1) {
            inventoryList = "This person has no possessions."
        }else{
            // Create an object to count the number of times each item appears in the array
            let itemCount = {};
            for (let item of dataUser.Inventory) {
            if (!itemCount[item]) {
                itemCount[item] = 0;
            }
            itemCount[item]++;
            }

            // Sort the array based on the count values in the object
            dataUser.Inventory.sort((a, b) => {
                if (itemCount[a] !== itemCount[b]) {
                  // Sort by frequency if the frequencies are different
                  return itemCount[b] - itemCount[a];
                } else {
                  // Sort alphabetically if the frequencies are the same
                  if (a < b) {
                    return -1;
                  } else if (a > b) {
                    return 1;
                  } else {
                    return 0;
                  }
                }
              });
            dataUser.save()

            inventoryList = Object.entries(
                userInventory.reduce((res, item) => ({...res, [item]: (res[item] || 0) + 1}), {})
                ).map(([name, count]) => `**${name}** ─ ${count}`).join('\n')
        }

            
            const inv = new EmbedBuilder()
            .setAuthor({name: `${user.username}'s inventory`, iconURL: user.avatarURL()})
            .setDescription(inventoryList)

            
            await interaction.reply({embeds: [inv]})

    }
}