require('dotenv').config();
const path = require('path');
const express = require('express');
const { Telegraf, Markup } = require('telegraf');

const token = (process.env.TELEGRAM_BOT_TOKEN || '').trim();
const bot = token ? new Telegraf(token) : null;

const port = Number(process.env.PORT || 3000);
const webAppUrl = (process.env.WEBAPP_URL || 'http://localhost:5173').trim();

const app = express();
const webDistPath = path.join(__dirname, 'rushskins-frontend', 'rushskins', 'dist');

app.use(express.static(webDistPath));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(webDistPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Web server listening on http://localhost:${port}`);
});

if (!bot) {
  console.warn('TELEGRAM_BOT_TOKEN is missing; bot will not start.');
} else {
  bot.start((ctx) => ctx.reply(
    'Привет! Открой приложение кнопкой ниже.',
    Markup.inlineKeyboard([
      Markup.button.webApp('Открыть RushSkins', webAppUrl),
    ]),
  ));
  bot.command('about', (ctx) => ctx.reply("твой хаб по CS2‑скинам: кейсы, коллекции, дейли, призы. самые жирные скины у нас!"));
  bot.help((ctx) => ctx.reply("Напиши мне что-нибудь"));
  bot.hears("привет", (ctx) => ctx.reply("привет, имбовые скины ждут тебя у нас в приложении!"));
  bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true));
  bot.on('successful_payment', (ctx) => {
    const payment = ctx.message.successful_payment;
    console.log('Successful Telegram payment:', {
      payload: payment.invoice_payload,
      currency: payment.currency,
      totalAmount: payment.total_amount,
      telegramPaymentChargeId: payment.telegram_payment_charge_id,
      providerPaymentChargeId: payment.provider_payment_charge_id,
    });
    return ctx.reply('Баланс пополнен. Спасибо за оплату!');
  });
  bot.on("message", (ctx) => {
    const text = ctx.message?.text;
    return ctx.reply(text ? "Ты написал: " + text : "Открой приложение кнопкой /start");
  });
  bot.launch();
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
}
