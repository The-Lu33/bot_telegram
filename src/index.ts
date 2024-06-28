import { listMessagesUnread } from "./mail/mails";
import { authorize } from "./auth/authorize";
import { BOT } from "./utils/bot_conn";

console.log("start bot");
console.log("auth");
let CHAT_ID: number | null = null;
let checkInterval: Timer | null = null;
let intervalTime: number = 5 * 60 * 1000; // 5 minutos por defecto

// Iniciar el bot y manejar el comando /start
BOT.start((ctx) => {
  ctx.reply("Bienvenido");
  console.log(ctx.chat.id);
  CHAT_ID = ctx.chat.id;
  console.log("starts");
});

// Comando para verificar nuevos correos manualmente
BOT.command("newmails", async (ctx) => {
  try {
    const auth = await authorize();
    console.log("Check Mails");
    await ctx.reply("Verificando nuevos correos");
    const mails = await listMessagesUnread(auth);

    if (mails.length > 0) {
      console.log("mails: ", mails.length - 1);
      await ctx.reply("Nuevos correos sin leer:");
      for (const mail of mails) {
        const message = `
Remitente: ${mail.from}
Asunto: ${mail.subject}
Fecha: ${mail.date}
Cuerpo: ${mail.body}
        `;
        await ctx.reply(message);
      }
    } else {
      await ctx.reply("No hay nuevos correos sin leer.");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
});

// Comando para iniciar la verificación periódica de correos
BOT.command("checkmails", async (ctx) => {
  try {
    CHAT_ID = ctx.chat.id;
    await ctx.reply("Buscando correos sin leer");
    checkMails();
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
});

// Comando para establecer el intervalo de tiempo
BOT.command("setinterval", (ctx) => {
  const input = ctx.message.text.split(" ");
  if (input.length !== 2) {
    return ctx.reply("Uso: /setinterval <minutos>");
  }

  const minutes = parseInt(input[1], 10);
  if (isNaN(minutes) || minutes <= 0) {
    return ctx.reply("Por favor, proporciona un número válido de minutos.");
  }

  intervalTime = minutes * 60 * 1000;
  if (checkInterval) {
    clearInterval(checkInterval);
  }
  checkInterval = setInterval(() => {
    checkMails().catch(console.error);
  }, intervalTime);

  ctx.reply(`Intervalo de tiempo establecido a ${minutes} minutos.`);
});

// Función para verificar correos
async function checkMails() {
  if (!CHAT_ID) return console.log("No chat ID");
  console.log("check Mails");

  const auth = await authorize();
  const mails = await listMessagesUnread(auth);
  console.log({ CHAT_ID });

  if (mails.length > 0) {
    console.log("mails: ", mails.length - 1);

    BOT.telegram.sendMessage(CHAT_ID, "Verificando nuevos correos");
    for (const mail of mails) {
      const message = `
Nuevo Correo Sin Leer
Remitente: ${mail.from}
Asunto: ${mail.subject}
Fecha: ${mail.date}
Cuerpo: ${mail.body}
      `;
      try {
        await BOT.telegram.sendMessage(CHAT_ID, message);
      } catch (error) {
        console.error("Error enviando mensaje a Telegram:", error);
      }
    }
  } else {
    BOT.telegram.sendMessage(CHAT_ID, "No hay nuevos correos por leer.");
  }

  checkInterval = setInterval(() => {
    checkMails().catch(console.error);
  }, intervalTime);
}
// iniciar login oauth 2.0
authorize();

// Iniciar el bot
BOT.launch()
  .then(() => {
    console.log("Bot iniciado");
    // checkInterval = setInterval(() => {
    //   checkMails().catch(console.error);
    // }, intervalTime);
  })
  .catch((err) => console.error(err));
