const { StatusCodes } = require("http-status-codes");
const Message = require("../models/message-model");

// Add message with conversationId
exports.postMessage = async (req, res) => {
  let message = new Message({
    conversationId: req.body.conversationId,
    message: req.body.message,
    dateMessage: Date.now(),
    sender: req.body.sender,
  });
  try {
    await message.save(function (err, data) {
      if (err) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
      } else {
        return res.status(StatusCodes.CREATED).json({ messageId: data._id });
      }
    });
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
  }
};

// Get message based on what conversation it belongs to.
exports.getByConversationId = async (req, res) => {
  const {
    params: { conversationId: conversationId },
  } = req;
  try {
    let messages = await Message.find({ conversationId: conversationId });
    return res.status(StatusCodes.OK).json(messages);
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
  }
};
