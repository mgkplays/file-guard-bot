import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

dotenv.config(); // load your TOKEN from .env

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
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // Trigger ONLY when there are EXACTLY 4 attachments
  if (message.attachments.size === 4) {
    try {
      const fileNames = message.attachments
        .map(a => `• ${a.name}`)
        .join("\n");

      // 1️⃣ Delete the message
      await message.delete();

      // 2️⃣ Find log channel
      const logChannel = message.guild.channels.cache.find(
        ch => ch.name === "automod-logs"
      );

      // 3️⃣ Send log
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
