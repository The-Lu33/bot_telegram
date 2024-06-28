import { promises as fs } from "fs";
import path from "path";
import process from "process";
import { authenticate } from "@google-cloud/local-auth";
import { google, Auth } from "googleapis";

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.modify",
];
const TOKEN_PATH = path.join(process.cwd(), "src/token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "src/credentials.json");
// chequear si existe token o session en caso que no crear una nueva
async function loadSavedCredentialsIfExist(): Promise<Auth.OAuth2Client | null> {
  try {
    const content = await fs.readFile(TOKEN_PATH, "utf8");
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials) as Auth.OAuth2Client;
  } catch (err) {
    return null;
  }
}
// guardar credenciales en token.json
async function saveCredentials(client: Auth.OAuth2Client): Promise<void> {
  const content = await fs.readFile(CREDENTIALS_PATH, "utf8");
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}
// función para autorizar al usuario abre una pestaña en el navegador para login en su cuenta de google
// return las credenciales necesarias para gmail
export async function authorize(): Promise<Auth.OAuth2Client> {
  const client = await loadSavedCredentialsIfExist();
  if (client) {
    console.log("session");
    return client;
  }
  const auth_client = (await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  })) as unknown as Auth.OAuth2Client;

  // console.log(auth_client);
  if (auth_client.credentials) {
    console.log("Login");
    await saveCredentials(auth_client);
  }
  return auth_client;
}
