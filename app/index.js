// Supports ES6
// import { create, Whatsapp } from 'venom-bot';
const venom = require('venom-bot');


venom
  .create({
    session: 'rosa' //name of session
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

let lastMessageTime = new Map();

function sendWelcomeMessage(client, chatId) {
  client.sendText(chatId, 'Welcome to the bot!');
}

  function start(client) {
    console.log("Started");
    client.onMessage((message) => {
      let now = Date.now();
      let sixHours = 120000;// 2 minutes //6* 60 * 60 * 1000; // 6 hours in milliseconds
  
      if (lastMessageTime.has(message.chatId)) {
        let lastTime = lastMessageTime.get(message.chatId);
        if (now - lastTime > sixHours) {
          sendWelcomeMessage(client, message.chatId);
        }
      } else {
        sendWelcomeMessage(client, message.chatId);
      }

      if (message.body === 'Hi') client.sendText(message.from, '👋 Hello!');
  
      lastMessageTime.set(message.chatId, now);
    });
  }
  
  