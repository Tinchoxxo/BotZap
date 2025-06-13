// LEOXEL4S/globalConfig.js

global.owner = ["0000000000"];
global.ownername = "ᴸᴱᴼˣᴱᴸ⁴ˢ 👁️‍🗨️";
global.location = "Brasil";
global.botname = 'BASE-LEOMODDZ <✓>';

// Link qualquer que tenha imagem (pode trocar depois)
global.link = 'https://i.ibb.co/YBPRQP6H/file-000000001df06230a46b108eedfd8a73.png';

global.prefa = ['', ' ', '!'];
global.limitawal = {
  premium: "Infinity",
  free: 20
};

const fs = require('fs');
const file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(`Atualizado o arquivo de configuração: ${__filename}`);
  delete require.cache[file];
  require(file);
});