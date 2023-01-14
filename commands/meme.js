const { SlashCommandBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch')


module.exports = {
	
	data: new SlashCommandBuilder()
		.setName('meme')
		.setDescription('Automatically generates a funny meme!')
		.addStringOption(option =>
		option.setName('choice')
		.setDescription('Choose your subreddit!')
		.setRequired(true)
		.addChoices(
			{ name: 'r/memes', value: 'memes' },
			{ name: 'r/wholesomememes', value: 'wholesomememes' },
			{ name: 'r/dankmemes', value: 'dankmemes' },
			{ name: 'r/comedymemes', value: 'comedymemes' },
			{ name: 'r/programmerhumor', value: 'programmerhumor' },
			{ name: 'r/cursedcomments', value: 'cursedcomments' },
			{ name: 'Kies voor mij', value: 'rndm' },
		)),



	async execute(client, interaction) {
		var choice = interaction.options.getString('choice')

		if (choice == 'rndm') {
			const array = ['memes', 'wholesomememes', 'dankmemes', 'comedymemes', 'programmarhumor', 'cursedcomments']

		 	choice = array[Math.floor(Math.random() * array.length)];
		}

		fetch(`https://www.reddit.com/r/${choice}/random/.json?q=cat&sort=top`).then(resp => resp.json()).then(respFormed => {

        var permaLink = respFormed[0].data.children[0].data.permalink;
        var memeUpvotes = respFormed[0].data.children[0].data.score;
        var memeUrl = `https://www.reddit.com${permaLink}`;
        var memePic = respFormed[0].data.children[0].data.url;
        var memeTitle = respFormed[0].data.children[0].data.title;
        var memeComments = respFormed[0].data.children[0].data.num_comments;

        var embed = new EmbedBuilder()
        .setTitle(`${memeTitle}`)
        .setDescription(`r/${choice}`)
        .setFooter({ text: `⭐ ${memeUpvotes} | 💬 ${memeComments}`})
        .setURL(`${memeUrl}`)
        .setImage(`${memePic}`)

		 interaction.reply({ embeds: [embed]})

    }).catch("error", (err) => {
        console.log(err.message);
    })
	
	},
};