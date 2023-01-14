const { SlashCommandBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');
const accounts = require('../data/accounts');
const cooldowns = require('mongo-cooldown')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('aoc_train')
		.setDescription('Train your fighter!')
        .addStringOption(option =>
            option.setName('option')
            .setDescription('Select an option.')
            .setRequired(true)
            .addChoices(
                { name: 'Agility', value: 'agility' },
                { name: 'Strength', value: 'strength' },
                { name: 'Defense', value: 'defense' },
                { name: 'Magic', value: 'magic' },
            )),

	async execute(client, interaction) {
        const dataUser = await accounts.findOne({ // Check if they have an account
            userid: interaction.member.id
        })
    
        if (!dataUser) { // Does not exist
            return await interaction.reply({content: "You haven't registered an account yet, you can do so by using `/aoc_account register`", empherial: true})
        }


		const option = interaction.options.getString('option')

        if (option != "agility" && option != "strength" && option != "defense") {
            return await interaction.reply({content: "You can't train for this yet! (im working on it)", empherial: true})
        }   

        var cooldownTime = 60*60*1.25 // SECONDS
		const commandName = "aoc_train"
		cooldownTime = cooldownTime * 1000
		let cooldown = await cooldowns.checkCoolDown(interaction.member.id, commandName)
		if (cooldown.ready == true) {
			let cooldown = await cooldowns.addCoolDown(interaction.member.id, cooldownTime, commandName)
		}else{
			return await interaction.reply({ content: `**You have been rate-limited!**\nYou can use **'/${cooldown.command}'** again <t:${Math.round((Date.now() + cooldown.time) / 1000)}:R>`, ephemeral: true})	
		}

        if (!dataUser.Achievements.includes("Workout Session")) {
            dataUser.Achievements.push("Workout Session")
            dataUser.save()
            const fail = new EmbedBuilder()
            .setAuthor({name: `${interaction.member.user.tag} - Achievement Unlocked!`, iconURL: interaction.member.user.avatarURL()})
            .setColor('Gold')
            .setTitle('Workout Session')
            .setDescription("Do your first workout using the `/aoc_train` command.")
            
            setTimeout(function() {
                interaction.channel.send({embeds: [fail]})
            }, 100)

        }

        if (option == "agility") {

            if (dataUser.Inventory.includes("Treadmail")) { // YES BOOST ITEM
                if (Math.random() < 0.25) { // FAIL
                    const fail = new EmbedBuilder()
                        .setAuthor({name: `${interaction.member.user.tag} - Workout Failed!`, iconURL: interaction.member.user.avatarURL()})
                        .setColor('Red')
                        .setDescription("You ran on your treadmail but you fell and hit your head against the floor. You didn't earn any agility points for this training.")
                        return await interaction.reply({embeds: [fail]})
                    }

                // SUCCESS
                const stats = new EmbedBuilder()
                    .setAuthor({name: `${interaction.member.user.tag} - Workout Completed`, iconURL: interaction.member.user.avatarURL()})
                    .setColor('Green')
                    .setDescription("You ran on your treadmail and gained **1** agility point!")
                
                dataUser.Agility = dataUser.Agility + 1
                dataUser.save()
                return await interaction.reply({embeds: [stats]})
            }else{ // NO BOOST ITEM

                if (Math.random() < 0.5) { // FAIL
                    const fail = new EmbedBuilder()
                        .setAuthor({name: `${interaction.member.user.tag} - Workout Failed!`, iconURL: interaction.member.user.avatarURL()})
                        .setColor('Red')
                        .setDescription("You ran outside but bruised your ankle! You didn't earn any agility points for this training.")
                        return await interaction.reply({embeds: [fail]})
                    }

                // SUCCESS
                const stats = new EmbedBuilder()
                    .setAuthor({name: `${interaction.member.user.tag} - Workout Completed`, iconURL: interaction.member.user.avatarURL()})
                    .setColor('Green')
                    .setDescription("You ran outside and gained **1** agility point!")
                
                dataUser.Agility = dataUser.Agility + 1
                dataUser.save()
                return await interaction.reply({embeds: [stats]})
            }

        }else if (option == "strength") {
            if (dataUser.Inventory.includes("Dumbbell")) { // YES BOOST ITEM
                if (Math.random() < 0.25) { // FAIL
                    const fail = new EmbedBuilder()
                        .setAuthor({name: `${interaction.member.user.tag} - Workout Failed!`, iconURL: interaction.member.user.avatarURL()})
                        .setColor('Red')
                        .setDescription("You tried lifting your dumbbell but you dropped it on your feet! You didn't gain any strength points for this training.")
                        return await interaction.reply({embeds: [fail]})
                    }

                // SUCCESS
                const stats = new EmbedBuilder()
                    .setAuthor({name: `${interaction.member.user.tag} - Workout Completed`, iconURL: interaction.member.user.avatarURL()})
                    .setColor('Green')
                    .setDescription("You trained your strength using your dumbbell and gained **1** strength point!")
                
                dataUser.Strength = dataUser.Strength + 1
                dataUser.save()
                return await interaction.reply({embeds: [stats]})
            }else{ // NO BOOST ITEM

                if (Math.random() < 0.6) { // FAIL
                    const fail = new EmbedBuilder()
                        .setAuthor({name: `${interaction.member.user.tag} - Workout Failed!`, iconURL: interaction.member.user.avatarURL()})
                        .setColor('Red')
                        .setDescription("You tried doing some pushups but you collapsed, you didn't earn any strength points for this training.")
                        return await interaction.reply({embeds: [fail]})
                    }

                // SUCCESS
                const stats = new EmbedBuilder()
                    .setAuthor({name: `${interaction.member.user.tag} - Workout Completed`, iconURL: interaction.member.user.avatarURL()})
                    .setColor('Green')
                    .setDescription("You did some pushups and gained **1** strength point!")
                
                dataUser.Strength = dataUser.Strength + 1
                dataUser.save()
                return await interaction.reply({embeds: [stats]})
            }
        }else if (option == "defense") {
            if (dataUser.Inventory.includes("Fighting Bot")) { // YES BOOST ITEM
                if (Math.random() < 0.3) { // FAIL
                    const fail = new EmbedBuilder()
                        .setAuthor({name: `${interaction.member.user.tag} - Workout Failed!`, iconURL: interaction.member.user.avatarURL()})
                        .setColor('Red')
                        .setDescription("You tried training your defense with your fighting bot, but it bounced back right in your face! You didn't gain any defense points for this training.")
                        return await interaction.reply({embeds: [fail]})
                    }

                // SUCCESS
                const stats = new EmbedBuilder()
                    .setAuthor({name: `${interaction.member.user.tag} - Workout Completed`, iconURL: interaction.member.user.avatarURL()})
                    .setColor('Green')
                    .setDescription("You trained with your fighting bot and gained **1** defense point!")
                
                dataUser.Strength = dataUser.Strength + 1
                dataUser.save()
                return await interaction.reply({embeds: [stats]})
            }else{ // NO BOOST ITEM

                if (Math.random() < 0.45) { // FAIL
                    const fail = new EmbedBuilder()
                        .setAuthor({name: `${interaction.member.user.tag} - Workout Failed!`, iconURL: interaction.member.user.avatarURL()})
                        .setColor('Red')
                        .setDescription("You did some sparring with your buddy, but then you realised you had none. You didn't earn any defense points for this training.")
                        return await interaction.reply({embeds: [fail]})
                    }

                // SUCCESS
                const stats = new EmbedBuilder()
                    .setAuthor({name: `${interaction.member.user.tag} - Workout Completed`, iconURL: interaction.member.user.avatarURL()})
                    .setColor('Green')
                    .setDescription("You did some sparring with your buddy's and gained **1** defense point!")
                
                dataUser.Defense = dataUser.Defense + 1
                dataUser.save()
                return await interaction.reply({embeds: [stats]})
            }
        }

	},
};