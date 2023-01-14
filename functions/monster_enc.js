const { Client, GatewayIntentBits, Routes, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityType } = require("discord.js");
const client = require('../index')
const accounts = require('../data/accounts');

const button = new ActionRowBuilder()
.addComponents(
    new ButtonBuilder()
    .setCustomId('yes')
    .setLabel('Fight it')
    .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
    .setCustomId('pet')
    .setLabel('Attempt to pet')
    .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
    .setCustomId('no')
    .setLabel('Run away')
    .setStyle(ButtonStyle.Danger),
)

module.exports = async function monsterEcounter(user, channel) {

    const dataUser = await accounts.findOne({
        userid: user.id
    })


    const monsterTypes = ["Zombie", "Skeleton", "Dragon", "Sex Offender"]
            const monster = monsterTypes[Math.floor(Math.random() * monsterTypes.length)];

            const difficultyTypes = ["easy", "medium", "hard"]
            const difficulty = difficultyTypes[Math.floor(Math.random() * difficultyTypes.length)];

            const monsterStats = {
                'Zombie': Math.floor(Math.random() * 5) + 2,
                'Dragon': Math.floor(Math.random() * 70) + 30,
                'Skeleton': Math.floor(Math.random() * 10) + 2,
                'Sex Offender': Math.floor(Math.random() * 50) + 10
            }

            var monsterStrength;
            if (difficulty == "easy") {
                monsterStrength = monsterStats[monster] * 0.5
            }else if (difficulty == "medium") {
                monsterStrength = monsterStats[monster] * 1
            }else{
                monsterStrength = monsterStats[monster] * 1.5
            }
            
            if (monsterStrength > 100){monsterStrength = 100}
            
            const StrengthDiffrence = monsterStrength - dataUser.Strength
            var chance;

            if (StrengthDiffrence > 0) { // Monster is stronger
                if (StrengthDiffrence > 0 && StrengthDiffrence <= 5) {chance = 0.45} else
                if (StrengthDiffrence > 5 && StrengthDiffrence <= 15) {chance = 0.3} else
                if (StrengthDiffrence > 15 && StrengthDiffrence <= 30) {chance = 0.2} else
                if (StrengthDiffrence > 30 && StrengthDiffrence <= 60) {chance = 0.1} else
                if (StrengthDiffrence > 60 && StrengthDiffrence <= 90) {chance = 0.05} else
                if (StrengthDiffrence > 90) {chance = 0}
                }else if (StrengthDiffrence < 0){ // Monster is weaker
                if (StrengthDiffrence < 0 && StrengthDiffrence >= -5) {chance = 0.65} else
                if (StrengthDiffrence < -5 && StrengthDiffrence >= -15) {chance = 0.75} else
                if (StrengthDiffrence < -15 && StrengthDiffrence >= -30) {chance = 0.85} else
                if (StrengthDiffrence < -30 && StrengthDiffrence >= -60) {chance = 0.90} else
                if (StrengthDiffrence < -60 && StrengthDiffrence >= -90) {chance = 0.95} else
                if (StrengthDiffrence < -90) {chance = 1}
                }else{ // Same Strength
                    chance = 0.5
                }

        const embed = new EmbedBuilder()
            .setAuthor({name: `${user.tag} - You encountered a monster!`, iconURL: user.avatarURL()})
            .setColor('Black')
            .setDescription(`You accountered an **${difficulty}** type **${monster}** with **${monsterStrength}** strength points. (Winchance: **${chance * 100}%**)`)

            
            const message = await channel.send({
                embeds: [embed],
                components: [button],
                fetchReply: true,
              });

              const collector = await channel.createMessageComponentCollector();
              collector.on("collect",collected => {
                  // Replies to the user who clicked a button that wasn't theirs
                  if(collected.user.id !== user.id){
                    collected.deferUpdate()
                      collected.reply({ content: `This isn't your fight..`, ephemeral: true })
                      return;
                  }
          
          
                  if(collected.customId === "yes"){
                    collected.deferUpdate()
                   

                    if (Math.random < chance) { // WIN
                        let rewardTable;
                        if (monster == "Zombie") {
                            rewardTable = ["Zombie Skin", "Rotten Flesh", "Common Crate Key", "Zombie Hand", "Pickaxe", "Shovel", "Fishing Rod"]
                        }else if (monster == "Skeleton") {
                            rewardTable = ["Skull", "Human Bones", "Common Crate Key", "Uncommon Crate Key", "Treasure Key", "Pickaxe", "Shovel", "Fishing Rod", "Magic Spell"]
                        }else if (monster == "Dragon"){
                            rewardTable = ["Dragons Tail", "Dragon Head", "Dragons Skin", "Rare Magic Spell", "Magic Spell", "Dragons Foot"]
                        }else if (monster == "Sex Offender"){
                            rewardTable = ["Golden Phallic Object", "Pink Phallic Object", "Male Sex Doll", "Female Sex Doll", "Tablet", "Phone"]
                        }else{
                            throw new Error("Invalid")
                        }

                        const reward = rewardTable[Math.floor(Math.random() * rewardTable.length)];


                        const embed = new EmbedBuilder()
                        .setAuthor({name: `${user.tag} - Successfully slayed a monster!`, iconURL: user.avatarURL()})
                        .setColor('Green')
                        .setDescription(`You defeated a ${monster}, after it died it dropped **${reward}**, you also earned **2** strength points.`)

                        dataUser.Inventory = dataUser.Inventory + reward
                        dataUser.Strength = dataUser.Strength + 2
                        dataUser.save()
                        message.edit({embeds: [embed], components: []})

                    }else{ // LOSE
                        let inv = dataUser.Inventory
                        const rndmInventoryItem = inv[Math.floor(Math.random() * inv)];
                        const rndmLostM = Math.floor(Math.random() * 400) + 200;
                        const rndmLostS = Math.floor(Math.random() * 5)

                        const embed = new EmbedBuilder()
                        .setAuthor({name: `${user.tag} - DIED!`, iconURL: user.avatarURL()})
                        .setColor('Red')
                        .setDescription(`You were killed by a ${monster}, and you lost **${rndmLostS}** strength points, **${rndmLostM}$**, and your **${rndmInventoryItem}**`)

                        dataUser.Strength = dataUser.Strength - rndmLostS
                        dataUser.Money = dataUser.Money - rndmLostM

                        let index = inv.indexOf(rndmInventoryItem)
                        dataUser.Inventory.splice(index, 1)

                        dataUser.save()

                        message.edit({embeds: [embed], components: []})

                    }

                  } else if (collected.customId === "pet"){
                    if (Math.random() < 0.3) {
                        collected.deferUpdate()
                        const embed = new EmbedBuilder()
                        .setAuthor({name: `${user.tag} - Successfully petted a monster!`, iconURL: user.avatarURL()})
                        .setColor('Green')
                        .setDescription(`You successfully petted a ${monster} and it blessed you with **1** Magic Point!`)

                        dataUser.Magic = dataUser.Magic + 1
                        dataUser.save() 
                        message.edit({embeds: [embed], components: []})
                    }else{
                        collected.deferUpdate()
                        const embed = new EmbedBuilder()
                        .setAuthor({name: `${user.tag} - Tried to pet a monster!`, iconURL: user.avatarURL()})
                        .setColor('Red')
                        .setDescription(`You tried to pet a ${monster} but it tore you apart! You lost **3** strength & defense points`)


                        dataUser.Strength = dataUser.Strength - 3
                        dataUser.Defense = dataUser.Defense - 3
                        if (dataUser.Defense < 0){dataUser.Defense = 0}
                        if (dataUser.Strength < 0){dataUser.Strength = 0}
                        dataUser.save() 
                        message.edit({embeds: [embed], components: []})
                    }
                  } else if (collected.customId === "no"){
                    collected.deferUpdate()
                    message.edit({content: "You've fled the scene.. You lost **1** agility point.", embeds: [], components: []})
                    dataUser.Agility = dataUser.Agility - 1
                    dataUser.save()
                }

              })
}