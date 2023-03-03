const messageController = require('../features/message/message.controller');

const messageRoutes = (app) => {
 
  app.post('/message-us', messageController.createMessage);

}

module.exports = {messageRoutes};