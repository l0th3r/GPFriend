const { SlashCommandBuilder } = require('@discordjs/builders');

const wait = require('util').promisify(setTimeout);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong (test if the bot online).'),
	async execute(interaction) {
		await interaction.reply('Pong!');
        await wait(2000);
		await interaction.editReply("Oui je suis co t'en fais pas ;)");
	},
};
