const { Client, GatewayIntentBits, Routes, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityType } = require("discord.js");
const client = require('../index')
const stocksPrices = require('../data/stockPrices');
const stockPrices = require("../data/stockPrices");

client.once("ready", async () => {
    var stockPrices1 = await stocksPrices.findOne({ // Retrieve Data
        company: "Pear Electronics"
    })

    var stockPrices2 = await stocksPrices.findOne({ // Retrieve Data
        company: "RaceX"
    })

    if (!stockPrices1) {
        let stockPrices1 = new stocksPrices({
            company: "Pear Electronics",
            currentPrice: 500,
            price1HrAgo: 0,
            price2HrAgo: 0,
            price3HrAgo: 0,
            price4HrAgo: 0,
            price5HrAgo: 0,
            price6HrAgo: 0,
            price7HrAgo: 0,
            price8HrAgo: 0,

        })

       await stockPrices1.save()
    }

    if (!stockPrices2) {
        let stockPrices2 = new stocksPrices({
            company: "RaceX",
            currentPrice: 500,
            price1HrAgo: 0,
            price2HrAgo: 0,
            price3HrAgo: 0,
            price4HrAgo: 0,
            price5HrAgo: 0,
            price6HrAgo: 0,
            price7HrAgo: 0,
            price8HrAgo: 0,
          
        })

        await stockPrices2.save()

    }


})
var now = new Date();
var delay = 60 * 60 * 1000; // 1 hour in msec
var start = delay - (now.getMinutes() * 60 + now.getSeconds()) * 1000 + now.getMilliseconds()


setTimeout(async function doSomething() {

    var stockPrices1 = await stocksPrices.findOne({ // Retrieve Data
        company: "Pear Electronics"
    })

    var stockPrices2 = await stocksPrices.findOne({ // Retrieve Data
        company: "RaceX"
    })

        const percentage1 = Math.random() * (4.05 - (-4)) + (-4)
        const percentage2 = Math.random() * (4.05 - (-4)) + (-4)

        const value1 = stockPrices1.currentPrice
        const value2 = stockPrices1.currentPrice
        const newValue1 = Math.round(value1 * (1 + (percentage1 / 100)))
        const newValue2 = Math.round(value2 * (1 + (percentage2 / 100)))

        stockPrices1.currentPrice = newValue1
        stockPrices1.price1HrAgo = stockPrices1.currentPrice
        stockPrices1.price2HrAgo = stockPrices1.price1HrAgo
        stockPrices1.price3HrAgo = stockPrices1.price2HrAgo
        stockPrices1.price4HrAgo = stockPrices1.price3HrAgo
        stockPrices1.price5HrAgo = stockPrices1.price4HrAgo
        stockPrices1.price6HrAgo = stockPrices1.price5HrAgo
        stockPrices1.price7HrAgo = stockPrices1.price6HrAgo
        stockPrices1.price8HrAgo = stockPrices1.price7HrAgo

        stockPrices2.currentPrice = newValue2
        stockPrices2.price1HrAgo = stockPrices2.currentPrice
        stockPrices2.price2HrAgo = stockPrices2.price1HrAgo
        stockPrices2.price3HrAgo = stockPrices2.price2HrAgo
        stockPrices2.price4HrAgo = stockPrices2.price3HrAgo
        stockPrices2.price5HrAgo = stockPrices2.price4HrAgo
        stockPrices2.price6HrAgo = stockPrices2.price5HrAgo
        stockPrices2.price7HrAgo = stockPrices2.price6HrAgo
        stockPrices2.price8HrAgo = stockPrices2.price7HrAgo

        await stockPrices1.save()
        await stockPrices2.save()


        const channel = client.channels.cache.find(channel => channel.name === "stock-updates")

        const embed = new EmbedBuilder()
        .setDescription(`Company Value — Pear Electronics\n${value1}$`)
        .setColor('DarkButNotBlack')
        const embed2 = new EmbedBuilder()
        .setDescription(`Company Value — RaceX\n${value2}$`)
        .setColor('DarkButNotBlack')

        await channel.messages.fetch({around: '1061257545236369448', limit: 1})
        .then(msg => {
            const fetchedMsg = msg.first();
            fetchedMsg.edit({embeds: [embed]});
        });

        await channel.messages.fetch({around: '1061257546083618917', limit: 1})
        .then(msg => {
            const fetchedMsg = msg.first();
            fetchedMsg.edit({embeds: [embed2]});
        });
        

    setTimeout(doSomething, delay);
 }, start);

