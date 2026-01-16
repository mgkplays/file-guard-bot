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

  if (message.attachments.size >= 3) {
    try {
      await message.delete();
      await message.member.timeout(10 * 60 * 1000, 
        "Sent 3+ files in one message");
      console.log(`Timed out ${message.author.tag}`);
    } catch (err) {
      console.error(err);
    }
  }
});

client.login(TOKEN);
