const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const Conversation = Schema({
  id: {
    type: ObjectId,
  },
  name: {
    type: String,
    required: [true, "Please set a chat name"],
  },
  dateCreated: {
    type: Date,
  },
  dateLastMessage: {
    type: Date,
  },
  messages: [{ type: ObjectId }],
  participants: [{ type: String }],
});

module.exports = mongoose.model("Conversation", Conversation);
