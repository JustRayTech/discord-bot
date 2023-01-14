const { SlashCommandBuilder, TextInputStyle, EmbedBuilder, messageLink } = require('discord.js');
const accounts = require('../data/accounts');
const cooldowns = require('mongo-cooldown')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('aoc_gamble')
		.setDescription('Gamble all of your money away!')
        .addStringOption(option =>
            option.setName('option')
            .setDescription('Select the game you want to use to gamble!')
            .setRequired(true)
            .addChoices(
                { name: 'Explanation', value: 'help' },
                { name: 'Dice Throw', value: 'dice' },
                { name: 'Slot Machine', value: 'slot' },
                { name: 'Scratch Card', value: 'scratch'}
            ))
        .addNumberOption(option =>
            option.setName('amount')
            .setDescription('Amount you want to gamble?')
            .setRequired(true)
        ),

	async execute(client, interaction) {
        const dataUser = await accounts.findOne({ // Check if they have an account
            userid: interaction.member.id
        })
    
        if (!dataUser) { // Does not exist
            return await interaction.reply({content: "You haven't registered an account yet, you can do so by using `/aoc_account register`", empherial: true})
        }


		const option = interaction.options.getString('option')
        const amount = interaction.options.getNumber('amount')

      
        if (dataUser.Money < amount ) {
            return await interaction.reply("You dont have enough money for this!")
        }

        if (!dataUser.Achievements.includes("Gamble Addiction")) {
            dataUser.Achievements.push("Gamble Addiction")
            const fail = new EmbedBuilder()
            .setAuthor({name: `${interaction.member.user.tag} - Achievement Unlocked!`, iconURL: interaction.member.user.avatarURL()})
            .setColor('Gold')
            .setTitle('Gamble Addiction')
            .setDescription("Go and gamble your money away!")
            
            setTimeout(function() {
                interaction.channel.send({embeds: [fail]})
            }, 100)

        }

        if (option == "help") {
            const helplp = new EmbedBuilder()
            .setAuthor({name: `${interaction.member.user.tag} - Gambeling Information`, iconURL: interaction.member.user.avatarURL()})
            .setColor('Green')
            .setDescription("In order to gamble, select your game and your bet if you win. Please note to play responsibly and don't gamble all of your money away.\n\n**Dice Throw**\nBoth you and the bot throw 2 dices, the person with the highest total number wins.\n\n**Slot Machine**\nYou have 3 reels that each generate a random symbol, if you have 2 the same you win, if you have 3 the same you win the jackpot. The joker prevents you from getting 3 on a row and reduces your chances for 2 on a row.")
            interaction.reply({embeds: [helplp]})
        }else if (option == "dice") {
            if (amount < 50) {
                return await interaction.reply("You need to gamble with at least **50$** or more for this game.")
            }
    
            if (amount > 250) {
                return await interaction.reply("You can only gamble with **250$** or less for this game.")
            }

            let botDice1 = Math.floor(Math.random() * 6) + 1;
            let botDice2 = Math.floor(Math.random() * 6) + 1;
            let userDice1 = Math.floor(Math.random() * 6) + 1;
            let userDice2 = Math.floor(Math.random() * 6) + 1;

            let totalBot = botDice1 + botDice2
            let totalUser = userDice1 + userDice2

            if (totalBot > totalUser) { // LOST
                const embed = new EmbedBuilder()
                .setAuthor({name: `${interaction.member.user.tag} - You lost!`, iconURL: interaction.member.user.avatarURL()})
                .setColor('Red')
                .setDescription(`**BOT:**
                🎲 — ${botDice1}
                🎲 — ${botDice2}
                
                **YOU:**
                🎲 — ${userDice1}
                🎲 — ${userDice2}
                
                You lost ${amount}$!`)

                dataUser.Money = dataUser.Money - amount
                dataUser.save()
                return await interaction.reply({embeds: [embed]})
    
            }else if (totalBot == totalUser) { // DRAW
                const embed = new EmbedBuilder()
                .setAuthor({name: `${interaction.member.user.tag} - It's a draw!`, iconURL: interaction.member.user.avatarURL()})
                .setColor('Grey')
                .setDescription(`**BOT:**
                🎲 — ${botDice1}
                🎲 — ${botDice2}
                
                **YOU:**
                🎲 — ${userDice1}
                🎲 — ${userDice2}`)
                dataUser.save()
                return await interaction.reply({embeds: [embed]})
            }else{ // WIN
                const embed = new EmbedBuilder()
                .setAuthor({name: `${interaction.member.user.tag} - You won!`, iconURL: interaction.member.user.avatarURL()})
                .setColor('Green')
                .setDescription(`**BOT:**
                🎲 — ${botDice1}
                🎲 — ${botDice2}
                
                **YOU:**
                🎲 — ${userDice1}
                🎲 — ${userDice2}
                
                You won ${2 * amount}$!`)
                dataUser.Money = dataUser.Money + amount
                dataUser.save()
                return await interaction.reply({embeds: [embed]})
            }
        }else if (option == "slot") {
        if (amount < 10) {
            return await interaction.reply("You need to gamble with at least **10$** or more for this game.")
        }

        if (amount > 100) {
            return await interaction.reply("You can only gamble with **100$** or less for this game.")
        }

        var cooldownTime = 10 // SECONDS
		const commandName = "aoc_gamble_slot"
		cooldownTime = cooldownTime * 1000
		let cooldown = await cooldowns.checkCoolDown(interaction.member.id, commandName)
		if (cooldown.ready == true) {
			let cooldown = await cooldowns.addCoolDown(interaction.member.id, cooldownTime, commandName)
		}else{
			return await interaction.reply({ content: `**You have been rate-limited!**\nYou can use **'/${cooldown.command}'** again <t:${Math.round((Date.now() + cooldown.time) / 1000)}:R>`, ephemeral: true})	
		}

        const symbols = ['🃏', '🍒', '🍒', '🍒', '🍋','🍋','🍋', '🔔','🔔', '🥇','🥇', '💎'];
        const payoutMultiplier = {
            '🃏': 0,
            "🍒": 3,
            '🍋': 3,
            '🔔': 4,
            '🥇': 5,
            '💎': 10,
          };

          function spin() {
            const result = [];
            for (let i = 0; i < 3; i++) {
              result.push(symbols[Math.floor(Math.random() * symbols.length)]);
            }
            return result;
          }

        const result = spin()
        let symbol;
        symbol = result[0];

        if (result[0] === result[1] && result[1] === result[2]) {
            const embed = new EmbedBuilder()
            .setAuthor({name: `${interaction.member.user.tag} - JACKPOT!`, iconURL: interaction.member.user.avatarURL()})
            .setColor('Gold')
            .setDescription(`**YOU WON THE JACKPOT!**\n[ ${result[0]} | ${result[1]} | ${result[2]} ]\n\nYour stake was **${amount}$** and you won **${amount * payoutMultiplier[symbol]}$** which is **${(amount * payoutMultiplier[symbol]) - amount}$** profit!`)

            dataUser.Money = (dataUser.Money - amount) + amount * payoutMultiplier[symbol]
            dataUser.save()

            interaction.reply({embeds: [embed]});
        } else {
       
            let payout = 0;
            const symbolCounts = {};
            for (const symbol of result) {
              if (!symbolCounts[symbol]) {
                symbolCounts[symbol] = 0;
              }
              symbolCounts[symbol]++;
            }
            for (const [symbol, count] of Object.entries(symbolCounts)) {
              if (count >= 2) {
                payout = payoutMultiplier[symbol] / 2;
                break;
              }
        }
            if (payout > 0) {
                const embed = new EmbedBuilder()
                .setAuthor({name: `${interaction.member.user.tag} - Won!`, iconURL: interaction.member.user.avatarURL()})
                .setColor('Green')
                .setDescription(`**YOU WON!**\n[ ${result[0]} | ${result[1]} | ${result[2]} ]\n\nYour stake was **${amount}$** and you won **${amount * payout}$** which is **${(amount * payout) - amount}$** profit!`)
    
    
                interaction.reply({embeds: [embed]});
                dataUser.Money = (dataUser.Money - amount) + amount * payout
                dataUser.save()
            } else {
                const embed = new EmbedBuilder()
                .setAuthor({name: `${interaction.member.user.tag} - Lost!`, iconURL: interaction.member.user.avatarURL()})
                .setColor('Red')
                .setDescription(`**YOU LOST!**\n[ ${result[0]} | ${result[1]} | ${result[2]} ]\n\nYour stake was **${amount}$** and you lost all of it`)
    
    
                interaction.reply({embeds: [embed]});


                dataUser.Money = dataUser.Money - amount
                dataUser.save()
            }
        }
        }else if (option == "scratch") {
            if (amount != 50) {
                return await interaction.reply("A scratch card costs **50$**")
            }

            return await interaction.reply("Not finished")

            var cooldownTime = 10 // SECONDS
            const commandName = "aoc_gamble_scratch"
            cooldownTime = cooldownTime * 1000
            let cooldown = await cooldowns.checkCoolDown(interaction.member.id, commandName)
            if (cooldown.ready == true) {
                let cooldown = await cooldowns.addCoolDown(interaction.member.id, cooldownTime, commandName)
            }else{
                return await interaction.reply({ content: `**You have been rate-limited!**\nYou can use **'/${cooldown.command}'** again <t:${Math.round((Date.now() + cooldown.time) / 1000)}:R>`, ephemeral: true})	
            }

            const prices = ['5', '10', '25', '50', '100','200','500', '1000'];
            const payout = {
                '5': 0,
                "10": 3,
                '25': 3,
                '50': 4,
                '100': 5,
                '200': 10,
                '500': 500,
                '1000': 1000,
              };

              function spin() {
                const result = [];
                for (let i = 0; i < 4; i++) {
                  result.push(prices[Math.floor(Math.random() * prices.length)]);
                }
                return result;
              }

        }
	},
};