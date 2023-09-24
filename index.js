//Simple bot discord ticket.
//Creator: M4rdok.

require("dotenv").config()
const Discord = require("discord.js")
const client = new Discord.Client({
    intents: [
        "Guilds",
        "GuildMembers",
        "GuildMessages",
        "MessageContent"
    ]
})

client.on("ready", async () => {
    console.log(`[+] Criado por: m4rdok.`)
})

client.on("messageCreate", async (message) => {
    if (message.content.startsWith(".ticket")) {
        const arrows = new Discord.ActionRowBuilder()
        arrows.addComponents(
            new Discord.ButtonBuilder()
                .setLabel("Abrir Ticket")
                .setCustomId("openTicket")
                .setStyle(Discord.ButtonStyle.Primary)
        )
        const embed = new Discord.EmbedBuilder()
        embed.setTitle("Ticket")
        embed.setColor("#2F3136")
        embed.setDescription(`
            Reaja ao botão abaixo para abrir seu ticket!
        `)
        message.delete()
        message.channel.send({ embeds: [embed], components: [arrows] })
    }
})

client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === "openTicket") {
            const categoryId = "" //ID da categoria que serão criados os tickets.
            const staffRoleId = "" //ID do cargo que irá permitir ao staff ver e mandar mensagem no canal.
            interaction.guild.channels.create({
                type: Discord.TextChannel,
                name: `ticket-${interaction.user.username}`,
                parent: categoryId,
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.cache.get(staffRoleId),
                        allow: [Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.SendMessages]
                    },
                    {
                        id: interaction.guild.roles.everyone,
                        deny: [Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.SendMessages]
                    },
                    {
                        id: interaction.user.id,
                        allow: [Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.SendMessages]
                    }
                ]
            }).then(async (c) => {
                const arrows = new Discord.ActionRowBuilder()
                arrows.addComponents(
                    new Discord.ButtonBuilder()
                        .setLabel("Fechar Ticket")
                        .setCustomId(`closeTicket-${interaction.user.id}`)
                        .setStyle(Discord.ButtonStyle.Primary)
                )
                const embedTicket = new Discord.EmbedBuilder()
                embedTicket.setTitle(`Suporte`)
                embedTicket.setColor("#2F3136")
                embedTicket.setDescription(`
                    Aguarde um membro de nossa equipe visualizar seu ticket e responder. <@&${staffRoleId}>
                `)
                c.send({ embeds: [embedTicket], components: [arrows] })
            })
        } else if (interaction.customId === `closeTicket-${interaction.user.id}`) {
            interaction.channel.delete()
        }
    }
})

client.login(process.env["TOKEN"])
