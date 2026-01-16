import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

const TOKEN = process.env.TOKEN;

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // Trigger ONLY when there are EXACTLY 4 images/files
  if (message.attachments.size === 4) {
    try {
      // Save attachment names BEFORE deleting
      const fileNames = message.attachments.map(a => `• ${a.name}`).join("\n");

      // 1️⃣ Delete the message (block it)
      await message.delete();

      // 2️⃣ Find the log channel
      const logChannel = message.guild.channels.cache.find(
        ch => ch.name === "automod-logs"
      );

      // 3️⃣ Send detailed log
      if (logChannel) {
        await logChannel.send({
          content:
`🚫 **AutoMod Action: Blocked Message**

👤 **User:** ${message.author.tag} (${message.author.id})  
📍 **Channel:** ${message.channel}  
📎 **Reason:** Image spam in one message  

🖼 **Deleted images:**  
${fileNames}`
        });
      }

      console.log(`Blocked 4-image message from ${message.author.tag}`);

    } catch (err) {
      console.error("Automod error:", err);
    }
  }
});

client.login(TOKEN);


const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is alive!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Web server running on port ${PORT}`));
