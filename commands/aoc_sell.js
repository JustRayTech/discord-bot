const { SlashCommandBuilder, TextInputStyle, EmbedBuilder, ApplicationCommandOptionWithChoicesAndAutocompleteMixin } = require('discord.js');
const accounts = require('../data/accounts');
const cooldowns = require('mongo-cooldown')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('aoc_sell')
		.setDescription('View your or someone else their achievements.')
        .addStringOption(option =>
            option.setName('item')
            .setDescription('Select an item to sell')
            .setRequired(true))
        .addNumberOption(option => 
            option.setName('amount')
            .setDescription("How much of this item do you wish to sell?")),



	async execute(client, interaction) {
        const user = interaction.user
        const itemtobeSold = interaction.options.getString('item').toLowerCase()
        var amountobeSold = interaction.options.getNumber('amount')

        const dataUser = await accounts.findOne({ // Retrieve Data
            userid: user.id
        })

        if (!dataUser) { // Does not exist
            return await interaction.reply({content: "You don't have an account yet, you can create one using `/aoc_account`", empherial: true})
        }


        var inv = dataUser.Inventory
        const count = inv.filter(element => element === itemtobeSold).length;

        if (amountobeSold == null){
            amountobeSold = count
        }


        const sellPricesOres = {
            aluminum: 12,
            bauxite: 15,
            chromite: 15,
            copper: 20,
            iron: 10,
            lead: 30,
            manganese:40,
            nickel: 60,
            tin: 70,
            zinc: 25,
            cobalt: 50,
            gold: 120,
            molybdenum: 60,
            platinum: 135,
            silver: 110,
            tungsten: 120,
            antimony: 130,
            arsenic: 140,
            beryllium: 140,
            cadmium: 150,
            chromium: 180,
            gallium: 200,
            indium: 250,
            lithium: 280,
            palladium: 290,
            rhodium: 300,
            selenium: 320,
            tellurium: 350,
            vanadium: 370,
            astatine: 400,
            francium: 1000,
            neptunium: 1000,
            plutonium: 900,
            radium: 700,
            uranium: 800
          };
          
        if (itemtobeSold in sellPricesOres || itemtobeSold == "ores"){}else{
            return await interaction.reply({content: "This item can't be sold!"})
        }

        if (dataUser.Inventory.includes(itemtobeSold) || itemtobeSold == "ores"){}else{
            return await interaction.reply({content: "You don't own this item, lmao?"})
        }

        if (itemtobeSold == "ores"){
            let profit = 0;
            let removedCount = 0;
            
            for (let i = 0; i < dataUser.Inventory.length; i++) {
                
              var item = dataUser.Inventory[i].toLowerCase()

              //console.log(i, item, sellPricesOres[item],profit)
              if (sellPricesOres[item]) {
                profit += sellPricesOres[item];
                dataUser.Inventory.splice(i, 1);
                i--; // decrease i to account for the removed item
                removedCount++;
              }
            }

            dataUser.Money = dataUser.Money + profit
            dataUser.save()
            return await interaction.reply(`Sold **${removedCount}** ores for a total of **${profit}$**`)



        }else{
            
            if (amountobeSold > count) {
                return await interaction.reply({content: `Hold up mate, You only have ${count}x ${itemtobeSold}!`})
            }

            let profit = sellPricesOres[itemtobeSold] * amountobeSold

            let index = dataUser.Inventory.indexOf(itemtobeSold)
            dataUser.Inventory.splice(index, amountobeSold)
            dataUser.Money = dataUser.Money + profit
            dataUser.save()

            return await interaction.reply(`Sold ${amountobeSold}x **${itemtobeSold}** for **${profit}$** (${sellPricesOres[itemtobeSold]}$/p)`)
        }
        


    }
}