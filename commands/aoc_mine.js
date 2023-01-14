const { SlashCommandBuilder, TextInputStyle, EmbedBuilder, Embed, IntegrationApplication } = require('discord.js');
const accounts = require('../data/accounts');
const cooldowns = require('mongo-cooldown');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('aoc_mine')
		.setDescription('Go mining for some ores, beware though! You might dig into a dungeon.'),

	async execute(client, interaction) {
            const dataUser = await accounts.findOne({
                userid: interaction.member.id
            })
        
            if (!dataUser) { // Does not exist
                return await interaction.reply({content: "You haven't registered an account yet, you can do so by using `/aoc_account register`", empherial: true})
            }

            if (!dataUser.Inventory.includes("Pickaxe")) { // Does not exist
                return await interaction.reply({content: "You need a pickaxe in order to mine! You can find one on an adventure or buy one from the shop.", empherial: true})
            }

        var cooldownTime = 60*60*0.5 // SECONDS
		const commandName = "aoc_mine"
		cooldownTime = cooldownTime * 1000
		let cooldown = await cooldowns.checkCoolDown(interaction.member.id, commandName)
		if (cooldown.ready == true) {
			let cooldown = await cooldowns.addCoolDown(interaction.member.id, cooldownTime, commandName)
		}else{
			return await interaction.reply({ content: `**You have been rate-limited!**\nYou can use **'/${cooldown.command}'** again <t:${Math.round((Date.now() + cooldown.time) / 1000)}:R>`, ephemeral: true})	
		}

        if (!dataUser.Achievements.includes("Mining Away")) {
            dataUser.Achievements.push("Mining Away")//
            const fail = new EmbedBuilder()
            .setAuthor({name: `${interaction.member.user.tag} - Achievement Unlocked!`, iconURL: interaction.member.user.avatarURL()})
            .setColor('Gold')
            .setTitle('Mining Away')
            .setDescription("Go on a mining adventure!")
            
            setTimeout(function() {
                interaction.channel.send({embeds: [fail]})
            }, 100)
        }

        const r1 = Math.random()
        const r = Math.random()
        let rarity;
        let type;
        let minedThing;
        let color;

        if (r1 < 0.65) { // ORE
            type = "ore"
            if (r < 0.58) { // 65% chance for a common ore
                const o = ['Aluminum', 'Bauxite', 'Chromite', 'Copper', 'Iron', 'Lead', 'Manganese', 'Nickel', 'Tin', 'Zinc'];
                minedThing = o[Math.floor(Math.random() * o.length)];
                rarity = 'common';
                color = 'Greyple';
              } else if (r < 0.80) { // 20% chance for uncommon ore
                const o = ['Cobalt', 'Gold', 'Molybdenum', 'Platinum', 'Silver', 'Tungsten'];
                minedThing = o[Math.floor(Math.random() * o.length)];
                rarity = 'uncommon';
                color = 'Green'
              } else if (r < 0.96) { // 11% chance
                const o = ['Antimony', 'Arsenic', 'Beryllium', 'Cadmium', 'Chromium', 'Gallium', 'Indium', 'Lithium', 'Palladium', 'Rhodium', 'Selenium', 'Tellurium', 'Vanadium'];
                minedThing = o[Math.floor(Math.random() * o.length)];
                rarity = 'rare';
                color = 'Aqua'
              } else {
                const o = ['Astatine', 'Francium', 'Neptunium', 'Plutonium', 'Radium', 'Uranium'];
                minedThing = o[Math.floor(Math.random() * o.length)];
                rarity = 'very rare';
                color = 'Purple'
              }      
        }else if (r < 0.9) { // GEM
            type = "gem"
            if (r < 0.65) { // 60% chance for a common ore
                const o = ['Agate', 'Amethyst', 'Aquamarine', 'Citrine', 'Garnet', 'Jasper', 'Opal', 'Peridot', 'Quartz', 'Topaz'];
                minedThing = o[Math.floor(Math.random() * o.length)];
                rarity = 'common';
                color = 'Greyple'
              } else if (r < 0.85) { // 20% chance for uncommon ore
                const o = ['Diamond', 'Emerald', 'Jade', 'Moonstone', 'Onyx', 'Sapphire', 'Turquoise'];
                minedThing = o[Math.floor(Math.random() * o.length)];
                rarity = 'uncommon';
                color = 'Green'
              } else if (r < 0.98) { // 15% chance
                const o = ['Alexandrite', 'Benitoite', 'Demantoid', 'Kunzite', 'Lapis Lazuli', 'Malachite', 'Morganite', 'Tsavorite', 'Zircon'];
                minedThing = o[Math.floor(Math.random() * o.length)];
                rarity = 'rare';
                color = 'Aqua'
              } else {
                const o = ['Black Opal', 'Fire Opal', 'Musgravite', 'Painite', 'Red beryl', 'Spinel', 'Black Diamond', 'Tanzanite']
                minedThing = o[Math.floor(Math.random() * o.length)];
                rarity = 'very rare';
                color = 'Purple'
              }   
        }else if (r < 0.95) {
            type = "treasure"
            color = 'Gold'
            const o = ['Pink Phallic Object', 'Sex Doll', 'Shovel', 'Golden Coin', 'Fishing Rod', 'Magic Spell', 'Diamond Ring']
            minedThing = o[Math.floor(Math.random() * o.length)];
        }else {
            type = "monster"
        }

        const mineEmbed = new EmbedBuilder()
        .setAuthor({name: `${interaction.member.user.tag} - You went mining!`, iconURL: interaction.member.user.avatarURL()})
        .setColor(color)
        .setDescription(`You went mining and found a **${rarity}** ${type} named ${minedThing}.`)
        dataUser.Inventory.push(minedThing)
        dataUser.save()
        return await interaction.reply({embeds: [mineEmbed]})





	},
};