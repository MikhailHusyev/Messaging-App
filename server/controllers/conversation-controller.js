const { StatusCodes } = require("http-status-codes");
const Conversation = require("../models/conversation-model");

// Create a new conversation that will store messages
exports.postConversation = async (req, res) => {
  let conversation = new Conversation({
    name: req.body.name,
    participants: req.body.participants,
    dateLastMessage: Date.now(),
    dateCreated: Date.now(),
  });
  try {
    await conversation.save(function (err, data) {
      if (err) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
      } else {
        return res
          .status(StatusCodes.CREATED)
          .json({ conversationId: data._id });
      }
    });
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
  }
};

// Get multiple conversations from the body of a list
exports.getConversations = async (req, res) => {
  let conversationIdList = req.body.conversations;
  let result = await Conversation.find({
    _id: { $in: conversationIdList },
  }).catch((error) => {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  });
  return res.status(StatusCodes.OK).json({ conversations: result });
};

//Get conversation by Id
exports.getConversationById = async (req, res) => {
  const {
    params: { conversationId: conversationId },
  } = req;
  let result = await Conversation.findById(conversationId).catch((error) => {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  });
  return res.status(StatusCodes.OK).json(result);
};

exports.updateDateLastMessage = async (req, res) => {
  const {
    params: { conversationId: conversationId },
  } = req;

  const newDate = req.body.dateLastMessage;

  await Conversation.findByIdAndUpdate(conversationId, {
    dateLastMessage: newDate,
  }).catch((error) => {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  });

  return res.status(StatusCodes.OK).json();
};
