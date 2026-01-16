import { Client, GatewayIntentBits } from "discord.js";
import express from "express";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

const TOKEN = process.env.TOKEN;
const app = express();

// ===== SIMPLE REPLIT KEEP-ALIVE (MUST EXIST FIRST) =====
app.get("/", (req, res) => {
  res.send("Bot is alive!");
});

// Start web server FIRST (important for Replit)
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Web server running on port ${PORT}`);
});

// ===== DISCORD BOT BELOW =====
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // Trigger ONLY when there are EXACTLY 4 attachments
  if (message.attachments.size === 4) {
    try {
      const fileNames = message.attachments
        .map(a => `• ${a.name}`)
        .join("\n");

      await message.delete(); // block the message

      const logChannel = message.guild.channels.cache.find(
        ch => ch.name === "automod-logs"
      );

      if (logChannel) {
        await logChannel.send({
          content: `
🚫 **AutoMod Action: Blocked Message**

👤 **User:** ${message.author.tag} (${message.author.id})  
📍 **Channel:** ${message.channel}  
📎 **Reason:** Exactly 4 images sent  

🖼 **Deleted images:**  
${fileNames}
`
        });
      }

      console.log(`Blocked 4-image message from ${message.author.tag}`);

    } catch (err) {
      console.error("Automod error:", err);
    }
  }
});

client.login(TOKEN);
