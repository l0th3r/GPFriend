const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

let Parser = require('rss-parser');
let RssParser = new Parser();

module.exports = {
    error: false,
    lastFetchDate: null,
    errorLog: "",
    api: true,
    data: new SlashCommandBuilder()
	.setName('afjvupdate')
    .setDescription("update afjv new.")
    /*.addStringOption( option =>
        option.setName('source')
        .setDescription('Specify The sub Reddit to fetch meme')
        .setRequired(false)
    )*/,
    async execute(interaction) {
        if(this.error === true) {
            interaction.reply("API ERROR : " + this.errorLog);
        }
        await interaction.deferReply();
        
        let feed = await RssParser.parseURL('https://www.afjv.com/afjv_rss.xml');
        var fetchDate = Date.parse(feed.lastBuildDate);

        // when the last time is done  
        if(this.lastFetchDate - fetchDate <= 0)
        {
            var embedMessages = [];
            this.lastFetchDate = fetchDate;

            var i = 0;
            feed.items.forEach(item => {
                if(i < 5)
                {
                    var tags = "";
                    item.categories.forEach(element => {
                        tags += ` #${element}`;
                    });

                    const article = new MessageEmbed()
                    .setAuthor("AFJV", "https://upload.wikimedia.org/wikipedia/fr/thumb/d/d3/AFJV_Logo_2.png/1081px-AFJV_Logo_2.png", feed.link)
                    .setTitle(item.title)
                    .setDescription(item.content)
                    .setColor(0x202020)
                    .setURL(item.link)
                    .setFooter(`Tags: ${tags} - ${new Date(item.isoDate).toLocaleDateString()}`)
                    
                    embedMessages.push(article);
                }
                i++;
            });

            interaction.editReply({ embeds: embedMessages });
        }
        else 
        {
            interaction.editReply("Already up to date.");
        }
    },
};