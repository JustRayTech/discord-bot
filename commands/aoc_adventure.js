const { SlashCommandBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const accounts = require('../data/accounts');
const cooldowns = require('mongo-cooldown');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('aoc_adventure')
		.setDescription('Reset, delete or create an account for Ascension of Conflict.')
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
            )),

	async execute(client, interaction) {
            const dataUser = await accounts.findOne({
                userid: interaction.member.id
            })
        
            if (!dataUser) { // Does not exist
                return await interaction.reply({content: "You haven't registered an account yet, you can do so by using `/aoc_account register`", empherial: true})
            }

        var cooldownTime = 60*60*2 // SECONDS
		const commandName = "aoc_adventure"
		cooldownTime = cooldownTime * 1000
		let cooldown = await cooldowns.checkCoolDown(interaction.member.id, commandName)
		if (cooldown.ready == true) {
			let cooldown = await cooldowns.addCoolDown(interaction.member.id, cooldownTime, commandName)
		}else{
			return await interaction.reply({ content: `**You have been rate-limited!**\nYou can use **'/${cooldown.command}'** again <t:${Math.round((Date.now() + cooldown.time) / 1000)}:R>`, ephemeral: true})	
		}

        if (!dataUser.Achievements.includes("Great Adventure")) {
            dataUser.Achievements.push("Great Adventure")
            const fail = new EmbedBuilder()
            .setAuthor({name: `${interaction.member.user.tag} - Achievement Unlocked!`, iconURL: interaction.member.user.avatarURL()})
            .setColor('Gold')
            .setTitle('Great Adventure')
            .setDescription("Go on a great adventure!")
            
            setTimeout(function() {
                interaction.channel.send({embeds: [fail]})
            }, 100)
        }

        const Choice = Math.floor(Math.random() * 5)
        if (Choice == 0) {
            const money = Math.floor(Math.random() * 100) + 10;
            const rndmchoice1 = ["Leeuwarden", "Groningen", "Amsterdam", "Rotterdam", "Your mom's house", "Your mom", "Lelystad"]
            const rndmchoice = rndmchoice1[Math.floor(Math.random()*rndmchoice1.length)];

            const embed = new EmbedBuilder()
            .setAuthor({name: `${interaction.member.user.tag} - You went on a great adventure!`, iconURL: interaction.member.user.avatarURL()})
            .setColor('Green')
            .setDescription(`You went on an adventure in ${rndmchoice} and found ${money}$`)

            dataUser.Money = dataUser.Money + money
            dataUser.save()
            return await interaction.reply({embeds: [embed]})
        }else if (Choice == 1) {
            const embed = new EmbedBuilder()
            .setAuthor({name: `${interaction.member.user.tag} - You went on a great adventure!`, iconURL: interaction.member.user.avatarURL()})
            .setColor('Green')
            .setDescription(`You went on an adventure in the mountains and went rockclimbing, earning yourself **1** strength point!`)

            dataUser.Strength = dataUser.Strength + 1
            dataUser.save()
            return await interaction.reply({embeds: [embed]})
        }else if (Choice == 2) {
            const rndmchoice1 = ["Leeuwarden", "Groningen", "Amsterdam", "Rotterdam", "Lelystad"]
            const rndmchoice = rndmchoice1[Math.floor(Math.random()*rndmchoice1.length)];
            const embed = new EmbedBuilder()
            .setAuthor({name: `${interaction.member.user.tag} - You went on a great adventure!`, iconURL: interaction.member.user.avatarURL()})
            .setColor('Green')
            .setDescription(`You went on an adventure in the streets of ${rndmchoice} but you were attacked! You successfully defended yourself and earned **1** defense point.`)

            dataUser.Defense = dataUser.Defense + 1
            dataUser.save()
            return await interaction.reply({embeds: [embed]})
        }else if (Choice == 3) {
            const rndmchoice1 = ["Leeuwarden", "Groningen", "Amsterdam", "Rotterdam", "Lelystad"]
            const rndmchoice = rndmchoice1[Math.floor(Math.random()*rndmchoice1.length)];
            const embed = new EmbedBuilder()
            .setAuthor({name: `${interaction.member.user.tag} - You went on a great adventure!`, iconURL: interaction.member.user.avatarURL()})
            .setColor('Green')
            .setDescription(`You went on an adventure in the streets of ${rndmchoice} but you were attacked! You successfully escaped and earned **1** agility point.`)

            dataUser.Agility = dataUser.Agility + 1
            dataUser.save()
            return await interaction.reply({embeds: [embed]})
        }else if (Choice == 4) {
            if (Math.random() < 0.1) {
                const rndmitem = ["Pickaxe", "Shovel", "Fishing Rod", "Black Phallic Object", "Silver Ring", "Fake Golden Ring"]
                const rndmitemchoice = rndmitem[Math.floor(Math.random()*rndmitem.length)]
                const embed = new EmbedBuilder()
                .setAuthor({name: `${interaction.member.user.tag} - You went on a super duper adventure!`, iconURL: interaction.member.user.avatarURL()})
                .setColor('Gold')
                .setDescription(`You went on an adventure and found ${rndmitemchoice}`)
                dataUser.Inventory.push(rndmitemchoice)
                dataUser.save()
                return await interaction.reply({embeds: [embed]})
            }else{
                const monsterEcounter = require('../functions/monster_enc')
		
                interaction.reply("Searching for a monster..")
                await monsterEcounter(interaction.user, interaction.channel)
                interaction.deleteReply()
        
        }
     
        }
 

	},
};