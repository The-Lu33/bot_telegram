import { google, Auth } from "googleapis";
interface MAILS {
  from: string;
  subject: string;
  body: string;
  date: string;
}
// obtener los detalles de cada correo por su messageId
async function getMailDetails(auth: Auth.OAuth2Client, messageId: string) {
  const gmail = google.gmail({ version: "v1", auth, timeout: 180000 });
  const res = await gmail.users.messages.get({
    userId: "me",
    id: messageId,
  });
  console.log(res)
  await gmail.users.messages.modify({
    userId: "me",
    id: messageId as string,
    requestBody: {
      removeLabelIds: ["UNREAD"],
    },
  });
  const message = res.data;
  const headers = message.payload?.headers || [];

  const from =
    headers.find((header) => header.name === "From")?.value || "No From";
  const subject =
    headers.find((header) => header.name === "Subject")?.value || "No Subject";
  const date =
    headers.find((header) => header.name === "Date")?.value || "No Date";

  let body = "";

  if (message.snippet) {
    body = message.snippet;
  } else if (message.payload?.parts) {
    const part = message.payload.parts.find(
      (part) => part.mimeType === "text/plain"
    );
    if (part && part.body?.data) {
      body = Buffer.from(part.body.data, "base64").toString("utf-8");
    }
  }

  //   console.log(`From: ${from}`);
  //   console.log(`Subject: ${subject}`);
  //   console.log(`Body: ${body}`);
  return {
    from,
    subject,
    body,
    date,
  };
}
// obtener la lista de los correos no leidos  y retornar un array de los mismo
export async function listMessagesUnread(auth: Auth.OAuth2Client) {
  try {
    const gmail = google.gmail({ version: "v1", auth, timeout: 180000 });
    const res = await gmail.users.messages.list({
      userId: "me",
      labelIds: ["UNREAD"],
      q: "is:unread",
      // maxResults: 60, // modificar a preferencia por default 100 emails por solicitud
    });
    // console.log(res);
    const messages = res.data.messages || [];
    if (messages.length === 0) {
      console.log("No new messages.");
      return [];
    }

    const mails: MAILS[] = [];
    for (const message of messages) {
      if (message.id) {
        const mailDetails = await getMailDetails(auth, message.id);
        mails.push(mailDetails);
      }
    }
    // console.log(mails);
    return mails;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    return [];
  }
}
