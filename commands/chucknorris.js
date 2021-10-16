const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const fetch = require('node-fetch');

module.exports = {
    error: false,
    errorLog: "",
    api: true,
    data: new SlashCommandBuilder()
	.setName('chuck')
    .setDescription("Search a joke or fact about Chuck. (I thought it was funny don't juge me)")
    .addStringOption( option =>
        option.setName('search')
        .setDescription('Add to search joke or fact')
        .setRequired(false)
    ),
    async execute(interaction) {
        if(this.error === true) {
            interaction.reply("API ERROR : " + this.errorLog);
        }
        
        await interaction.deferReply();

        if(interaction.options._hoistedOptions.length > 0) {        
            // get search value
            const searchArg = interaction.options._hoistedOptions.filter(arg => arg.name === 'search')[0].value;

            // get result and select one randomly
            const content = await fetch(`https://api.chucknorris.io/jokes/search?query=${searchArg}`).then(response => response.json());
            if(content.total > 0) {
                const selectedArticle = content.result[Math.floor(Math.random() * (content.total - 1))];
                
                // build response
                const response = new MessageEmbed()
                .setTitle(`Chuck Search Result for : ${searchArg}`)
                .setAuthor("api.chucknorris.io", selectedArticle.icon_url,"https://api.chucknorris.io/")
                .setColor(0xf15a24)
                .setDescription(`${selectedArticle.value}`)
                .setTimestamp(selectedArticle.created_at)
                
                interaction.editReply({ embeds: [response] });
            } else {
                interaction.editReply(`No result for **${searchArg}**`);
            }
        } else {
            const selectedArticle = await fetch(`https://api.chucknorris.io/jokes/random`).then(response => response.json());
            
            // build response
            const response = new MessageEmbed()
            .setTitle(`Random Chuck Norris joke/fact.`)
            .setAuthor("api.chucknorris.io", selectedArticle.icon_url,"https://api.chucknorris.io/")
            .setColor(0xf15a24)
            .setDescription(`${selectedArticle.value}`)
            .setTimestamp(selectedArticle.created_at)
            
            interaction.editReply({ embeds: [response] });
        }
    },
};