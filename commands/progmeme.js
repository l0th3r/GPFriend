const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const fetch = require('node-fetch');

module.exports = {
    error: false,
    errorLog: "",
    api: true,
    sources: ["ProgrammerHumor", "programmingmemes"],
    data: new SlashCommandBuilder()
	.setName('getmeme')
    .setDescription("Get a prog meme (I didn't make them maybe it's not funny).")
    .addStringOption( option =>
        option.setName('source')
        .setDescription('Specify The sub Reddit to fetch meme')
        .setRequired(false)
    ),
    async execute(interaction) {
        if(this.error === true) {
            interaction.reply("API ERROR : " + this.errorLog);
        }
        await interaction.deferReply();
        
        var selectedSource = this.sources[Math.floor(Math.random() * this.sources.length)];

        if(interaction.options._hoistedOptions.length > 0) {
            selectedSource = interaction.options._hoistedOptions.filter(arg => arg.name === 'source')[0].value;
        }

        const selectedArticle = await fetch(`https://meme-api.herokuapp.com/gimme/${selectedSource}`).then(response => response.json());

        if(selectedArticle.nsfw === false) {
            // build response
            const response = new MessageEmbed()
            .setAuthor("Posted on Reddit by: " + selectedArticle.author)
            .setTitle(selectedArticle.title)
            .setColor(0x202020)
            .setImage(selectedArticle.url)
            .setURL(selectedArticle.postLink)
            .setFooter(`Using D3vd's Meme_Api`)

            interaction.editReply({ embeds: [response] });
        } else if (selectedArticle.nsfw === true) {
            interaction.editReply("The API responded with a NSFW meme so... not in this server enfaite :)");
        } else {
            interaction.editReply(`Sorry, the sub Reddit ***${selectedSource}*** doesnt exist or doesn't have content :(`);
        }
    },
};