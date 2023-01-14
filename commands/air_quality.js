const { SlashCommandBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('air_quality')
		.setDescription('View the air_quality in leeuwarden.'),
		



	async execute(client, interaction) {
		await interaction.deferReply()
		let weatherData;
		await fetch('http://api.weatherapi.com/v1/current.json?key=1fa91bf8171146ddb6f153558223012&q=Leeuwarden&aqi=yes').then(res => res.json())
		.then(json => {
			weatherData = json
		})


		const WeatherEmbed = new EmbedBuilder()
		.setTitle("Air Quality Index")
		.setColor('Green')
		.addFields(
			{ name: 'Carbon Monoxide', value: `${Math.round(weatherData.current.air_quality.co)} µg/m³`, inline: true },
			{ name: 'Nitrogen Dioxide', value: `${Math.round(weatherData.current.air_quality.no2)} µg/m³`, inline: true },
			{ name: 'Sulfur Dioxide', value: `${Math.round(weatherData.current.air_quality.so2)} µg/m³`, inline: true },
			{ name: 'Ozone', value: `${Math.round(weatherData.current.air_quality.o3)} µg/m³`, inline: true },
			{ name: 'Particulate Matter', value: `${Math.round(weatherData.current.air_quality.pm10)} µg/m³`, inline: true },
			{ name: 'Fine Particulate Matter', value: `${Math.round(weatherData.current.air_quality.pm2_5)} µg/m³`, inline: true },
		)
		
		await interaction.editReply({embeds: [WeatherEmbed]})


	},
};