# BOT CHECKER MAILS by The Lú

## Configuración del Entorno de Gmail en Google Cloud Console

### Habilita la API de Gmail

Antes de usar las APIs de Google, debes activarlas en un proyecto de Google Cloud.

1. En la consola de Google Cloud, habilita la API de Gmail:
   [Habilitar API de Gmail](https://console.cloud.google.com/flows/enableapi?apiid=gmail.googleapis.com&hl=es-419)

### Configuración del Entorno OAuth 2.0

1. En la consola de Google Cloud, ve a Menú > APIs y servicios > Credenciales:
   [Ir a Credenciales](https://console.cloud.google.com/apis/credentials?hl=es-419)
2. Haz clic en **Crear credenciales** > **ID de cliente de OAuth**.
3. Selecciona **Tipo de aplicación** > **App de escritorio**.
4. En el campo **Nombre**, escribe un nombre para la credencial.
5. Haz clic en **Crear**. Aparecerá la pantalla de creación del cliente de OAuth con tu ID de cliente nuevo y el secreto del cliente.
6. Haz clic en **OK**. La credencial creada aparecerá en IDs de cliente de OAuth 2.0.

### Guardar Credenciales

1. Descarga el archivo JSON de las credenciales.
2. Guarda el archivo JSON como `credentials.json` y muévelo a tu directorio de trabajo `src/`.
3. Crea un archivo vacío `token.json` en el directorio `src/`.

## Ejecutar el Proyecto

### Instalación y Ejecución

1. Instala las dependencias del proyecto usando uno de los siguientes comandos:
   ```sh
   npm install
   # o
   pnpm install
   # o
   bun install
   # o
   yarn install
   ```
2. Corre el BOT con uno de los siguientes comandos:

```sh
 npm run dev
 # o
 pnpm run dev
 # o
 bun run dev
 # o
 yarn run dev
```

## Abrirá una pestaña para login de usuario en google conceder los permisos necesarios para lectura y escritura

## Uso del Bot de Telegram

Ve al bot de Telegram: [CheckTelegramMailBot](https://t.me/checkTelegramMailBot) y presiona **start**.

### Comandos Disponibles

- **/newmails**: Chequea manualmente los correos no leídos.
- **/checkmails**: Activa el chequeo continuo de correos (por defecto cada 5 minutos).
- **/setinterval <minutos>**: Modifica el intervalo de tiempo para el chequeo automático de correos.


