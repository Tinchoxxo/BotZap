/**
 * ┌─────────────────────────────────────────────┐
 * │                BASE BY LEO MODDZ                           │
 * │                                                                │
 * │   Por favor, mantenha os créditos intactos                    │
 * │   se for modificar ou repostar este código.                   │
 * │                                                              │
 * │   Canal no YouTube: LEO MODDZ                           │
 * │                                                             │
 * │               By LEONI MODDZ                             │
 * └──────────────────────────────────────────┘
 */
const { 
  default: makeWASocket, 
  DisconnectReason, 
  makeInMemoryStore, 
  jidDecode, 
  Browsers, 
  proto, 
  getContentType, 
  useMultiFileAuthState, 
  downloadContentFromMessage,
  generateWAMessage,
  areJidsSameUser,
  jidNormalizedUser
} = require("@adiwajshing/baileys")

const pino = require('pino')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const readline = require("readline");
const _ = require('lodash')
const FileType = require('file-type')
const path = require('path')
const yargs = require('yargs/yargs')
const PhoneNumber = require('awesome-phonenumber')
const simple = require('./LEOXEL4S/libxleomoddz0444/oke.js')
const { isUrl, generateMessageTag, getBuffer, getSizeMedia, fetch, sleep, reSize } = require('./LEOXEL4S/libxleomoddz0444/myfunc')

var low
try {
  low = require('lowdb')
} catch (e) {
  low = require('./LEOXEL4S/libxleomoddz0444/lowdb')
}
const { Low, JSONFile } = low
const mongoDB = require('./LEOXEL4S/libxleomoddz0444/mongoDB')

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
const opts = global.opts


global.db = new Low(
  /https?:\/\//.test(opts['db'] || '') ?
  /* new cloudDBAdapter(opts['db']) */ null : 
  /mongodb/.test(opts['db']) ?
  new mongoDB(opts['db']) :
  new JSONFile(`./LEOXEL4S/srleok/database.json`)
)

global.DATABASE = global.db 

async function loadDatabase() {
  if (global.db.READ) return new Promise((resolve) => setInterval(function () { 
    (!global.db.READ ? (clearInterval(this), resolve(global.db.data == null ? loadDatabase() : global.db.data)) : null) 
  }, 1 * 1000))
  if (global.db.data !== null) return
  global.db.READ = true
  await global.db.read()
  global.db.READ = false
  global.db.data = {
    users: {},
    chats: {},
    game: {},
    database: {},
    settings: {},
    setting: {},
    others: {},
    sticker: {},
    ...(global.db.data || {})
  }
  global.db.chain = _.chain(global.db.data)
}
loadDatabase()

const appenTextMessage = async (m, uwu, text, chatUpdate) => {
  let messages = await generateWAMessage(
    m.key.remoteJid,
    { text: text },
    { quoted: m.quoted }
  );
  messages.key.fromMe = areJidsSameUser(m.sender, uwu.user.id);
  messages.key.id = m.key.id;
  messages.pushName = m.pushName;
  if (m.isGroup) messages.participant = m.sender;
  let msg = {
    ...chatUpdate,
    messages: [proto.WebMessageInfo.fromObject(messages)],
    type: "append",
  };
  return uwu.ev.emit("messages.upsert", msg);
}

const question = (text) => { 
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout }); 
  return new Promise((resolve) => { rl.question(text, resolve) }) 
};


async function uwuStart() {
  const { state, saveCreds } = await useMultiFileAuthState("./LEOXEL4S/QUERKXX SENSION")
  const uwu = simple({
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
    auth: state,
    version: [2, 3000, 1017531287],
    browser: Browsers.ubuntu("Edge"),
    getMessage: async key => {
      const jid = jidNormalizedUser(key.remoteJid);
      const msg = await store.loadMessage(jid, key.id);
      return msg?.message || '';
    },
    shouldSyncHistoryMessage: msg => {
      console.log(`\x1b[32mLoading Chat [${msg.progress}%]\x1b[39m`);
      return !!msg.syncType;
    },
  }, store);

  if (!uwu.authState.creds.registered) {
    const phoneNumber = await question('INSIRA O NÚMERO 📱:\n');
    let code = await uwu.requestPairingCode(phoneNumber.replace(/[^\d]/g, ''));
    code = code?.match(/.{1,4}/g)?.join("-") || code;
    console.log(`Code :`, code);
  }
  store.bind(uwu.ev);

  uwu.ev.on('messages.upsert', async chatUpdate => {
    try {
      let mek = chatUpdate.messages[0]
      if (!mek.message) return
      mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
      if (mek.key && mek.key.remoteJid === 'status@broadcast') return
      if (!uwu.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
      if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
      let m = smsg(uwu, mek, store)
      require("./LEOMODDZ0444.js")(uwu, m, chatUpdate, store)
    } catch (err) {
      console.log(err)
    }
  })

  uwu.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;

      switch (reason) {
        case DisconnectReason.badSession: 
          console.error('ARQUIVO DE SESSÃO INVÁLIDO EXCLUINDO SESSÃO');
          fs.rmSync('./LEOXEL4S/QR code', { recursive: true, force: true });
          uwuStart();
          break;
        case DisconnectReason.connectionClosed: 
        case DisconnectReason.connectionLost:
        case DisconnectReason.timedOut:
          console.warn('CONEXÃO FECHADA RECONECTANDO! 👀');
          uwuStart();
          break;
        case DisconnectReason.loggedOut:
          console.error('USUÁRIO DESCONECTOU ❌!');
          fs.rmSync('./LEOXEL4S/QR code', { recursive: true, force: true });
          break;
        case DisconnectReason.restartRequired:
          console.log('REINICIAÇÃO NECESSÁRIA 🔁 RECONECTANDO...');
          uwuStart();
          break;
        default:
          console.error(`motivo de desconexão desconhecido:${reason}`);
          uwuStart();
          break;
      }
    } else if (connection === 'open') {
      console.log('USUÁRIO ONLINE ✅');
    }
  });

  uwu.ev.on('creds.update', saveCreds)

  return uwu
}

uwuStart().catch(console.error);


function smsg(conn, m, store) {
  if (!m) return m
  let M = proto.WebMessageInfo
  if (m.key) {
    m.id = m.key.id
    m.isBaileys = m.id && m.id.startsWith('BAE5')
    m.chat = m.key.remoteJid
    m.fromMe = m.key.fromMe
    m.sender = m.fromMe ? (conn.user.id.split(':')[0] + '@s.whatsapp.net') : (m.key.participant || m.key.remoteJid)
    m.pushName = m.pushName || ''
  }
  if (m.message) {
    m.mtype = getContentType(m.message)
    m.msg = m.message[m.mtype]
    if (m.mtype === 'ephemeralMessage') {
      m.mtype = getContentType(m.msg)
      m.msg = m.msg[m.mtype]
    }
  }
  return m
}