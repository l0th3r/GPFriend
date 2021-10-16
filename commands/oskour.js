const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const fetch = require('node-fetch');

module.exports = {
    error: false,
    errorLog: "",
    api: true,
    data: new SlashCommandBuilder()
	.setName('oskour')
    .setDescription('Ask programming question exemple: "how to install pip".')
    .addStringOption( option =>
        option.setName('search')
        .setDescription('What is the problem or question ?')
        .setRequired(true)
    ),
    async execute(interaction) {
        if(this.error === true) {
            interaction.editReply(`ERROR : ${this.errorLog}`);
        }
        await interaction.deferReply();

        // get search argument
        const arg = interaction.options._hoistedOptions.filter(arg => arg.name === 'search')[0].value;
        const query = encodeURIComponent(arg);
        const searchUrl = `https://www.codegrepper.com/api/search.php?q=${query}&search_options=search_titles`;
        const res = await fetch(searchUrl).then(response => response.json());
        const answers = res.answers;

        if(answers.length > 0) {
            const answer = answers[0];
            
            const exampleEmbed = new MessageEmbed()
            .setDescription(`Search result for: **${arg}**`)
            .addField('\u200B', this.ParseCode(answer.language, answer.answer))
            .addFields(
                { name: 'Language', value: answer.language, inline: true },
                { name: 'Key words', value: answer.term, inline: true },
                { name: '\u200B', value: '\u200B' },
            )
            .setTimestamp(answer.created_at)
            .setFooter(`Posted by ${answer.fun_name}`);
            
            interaction.editReply({ content: "<@" + interaction.user.id + ">", embeds: [exampleEmbed], ephemeral: true });
        } else {
            interaction.editReply({ content: `I'm sorry I didn't find anything for **${arg}** :(`, ephemeral: true });
        }
    },
    ParseCode (language, code) {
        return `\`\`\`${language}\n${code}\`\`\``;
    }
};