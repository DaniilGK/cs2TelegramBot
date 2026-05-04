require('dotenv').config();
const path = require('path');
const express = require('express');
const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const port = Number(process.env.PORT || 3000);
const webAppUrl = process.env.WEBAPP_URL || 'http://localhost:5173';

const app = express();
const webDistPath = path.join(__dirname, 'rushskins-frontend', 'rushskins', 'dist');

app.use(express.static(webDistPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(webDistPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Web server listening on http://localhost:${port}`);
});

bot.start((ctx) => ctx.reply(
  'Привет! Открой приложение кнопкой ниже.',
  Markup.inlineKeyboard([
    Markup.button.webApp('Открыть RushSkins', webAppUrl),
  ]),
));
bot.about((ctx) => ctx.reply("твой хаб по CS2‑скинам: кейсы, коллекции, дейли, призы. самые жирные скины у нас!"));
bot.help((ctx) => ctx.reply("Напиши мне что-нибудь"));
bot.hears("привет", (ctx) => ctx.reply("привет, имбовые скины ждут тебя у нас в приложении!"));
bot.on("message", (ctx) => ctx.reply("Ты написал: " + ctx.message.text));
bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));