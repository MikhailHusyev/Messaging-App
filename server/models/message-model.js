const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const Message = Schema({
  id: {
    type: ObjectId,
  },
  conversationId: {
    type: ObjectId,
    required: [true, "Please set a conversation"],
  },
  message: {
    type: String,
    required: [true, "Please enter a message"],
  },
  dateMessage: {
    type: Date,
  },
  sender: {
    type: String,
  },
});

module.exports = mongoose.model("Message", Message);
