const { SlashCommandBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('weather')
		.setDescription('View the weather in leeuwarden.'),
		



	async execute(client, interaction) {
		await interaction.deferReply()
		let weatherData;
		await fetch('http://api.weatherapi.com/v1/current.json?key=1fa91bf8171146ddb6f153558223012&q=Leeuwarden&aqi=yes').then(res => res.json())
		.then(json => {
			weatherData = json
		})

		let color
		let code


		if (Number(weatherData.current.temp_c) < -15 || Number(weatherData.current.gust_kph) > 150 || (Number(weatherData.current.vis_km) < 0.05)) {
			color = "Red"
			code = "— Code Red"
		}else if (Number(weatherData.current.temp_c) < -10 || Number(weatherData.current.gust_kph) > 100 || (Number(weatherData.current.vis_km) < 0.15 )){
			color = "Orange"
			code = "— Code Orange"
		}else if (Number(weatherData.current.temp_c) < -5 || Number(weatherData.current.gust_kph) > 60 || (Number(weatherData.current.vis_km) < 0.4)){
			color = "Yellow"
			code = "— Code Yellow"
		}else{
			color = "Green"
			code = " "
		}

		let wndDanger = ""
		let tempDanger = ""
		let visDanger = ""

		if (Number(weatherData.current.temp_c) < -5) {
			tempDanger = "<:warn:1050802602566234202>"
		}

		if (Number(weatherData.current.gust_kph) > 60) {
			wndDanger = "<:warn:1050802602566234202>"
		}

		if (Number(weatherData.current.vis_km) < 0.4) {
			visDanger = "<:warn:1050802602566234202>"
		}

		


		const WeatherEmbed = new EmbedBuilder()
		.setTitle(`${weatherData.current.condition.text} ${code}`)
		.setThumbnail(`https:${weatherData.current.condition.icon}`)
		.setColor(color)
		.addFields(
			{ name: `${tempDanger} Temperature`, value: `${weatherData.current.temp_c}°C`, inline: true },
			{ name: 'Feels like', value: `${weatherData.current.feelslike_c}°C`, inline: true },
			{ name: `${wndDanger} Wind Speed `, value: `${weatherData.current.wind_kph} gusting ${weatherData.current.gust_kph} km/h`, inline: true },
			{ name: 'Wind Direction', value: `${weatherData.current.wind_degree}° (${weatherData.current.wind_dir})`, inline: true },
			{ name: 'Precipitation', value: `${weatherData.current.precip_mm} mm`, inline: true },
			{ name: 'Cloud Cover', value: `${weatherData.current.cloud}%`, inline: true },
			{ name: 'Humidity', value: `${weatherData.current.humidity}%`, inline: true },
			{ name: `${visDanger} Visibility`, value: `${weatherData.current.vis_km} km`, inline: true },
			{ name: 'Pressure', value: `${weatherData.current.pressure_mb} mBar`, inline: true },
		)
		
		await interaction.editReply({embeds: [WeatherEmbed]})


	},
};