import { Telegraf } from "telegraf";
import "dotenv/config";
export const BOT = new Telegraf(process.env.checkTelegramMailBot as string).catch(
  (error) => console.log(error)
);

