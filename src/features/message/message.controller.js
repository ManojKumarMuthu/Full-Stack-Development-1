const Message = require('../../shared/db/mongodb/schemas/message.Schema')
const asyncWrapper = require('../../shared/util/base-utils')

const createMessage = asyncWrapper( async (req,res) => {
    const message = await  Message.create(req.body);
    res.status(201).json({ msg: 'Message created', data: message }); 
    console.log(message)
  });

  
module.exports = {createMessage};