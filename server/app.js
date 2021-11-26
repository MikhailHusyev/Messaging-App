require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const mainRoute = require("./routes/index");
const connectDB = require("./database/database");
const mongoURI = process.env.URI;
const http = require("http").Server(app);
const User = require("./models/user-model");
const Conversation = require("./models/conversation-model");

app.use(
  express.urlencoded({
    extended: true,
  }),
  cors(),
  express.json()
);

app.use("/api/v1", mainRoute);
// Handle connection
const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// List of users to get notifications
let users = [];
// List of users to get messages
let usersMessages = [];

// Filter socket to users that are others to recieve notifications
const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

//Add filter users that are not sender for message to be sent to
const addUserToMessages = (userId, socketId) => {
  !usersMessages.some((user) => user.userId === userId) &&
    usersMessages.push({ userId, socketId });
};

// Remove user socket for disconenct
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

// This is used to retrieve socket of user to send conersation notification to
const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

// This is used to retrieve socket of user to send message to
const getUserMessages = (userId) => {
  return usersMessages.find((user) => user.userId === userId);
};

//Start initial socket connection
io.on("connection", (socket) => {
  socket.on("find_user", function (value) {
    if (value == null) socket.emit("find_user_result", {});
    User.find({ user_name: { $regex: value } }, function (err, data) {
      if (data) socket.emit("find_user_result", data);
    });
  });

  // Connect user to notifications
  socket.on("connect_user", (userId) => {
    addUser(userId, socket.id);
  });

  // Connect users to conversation rooms
  socket.on("addUser", (username) => {
    addUserToMessages(username, socket.id);
    io.emit("getUsers", usersMessages);
  });

  // Send and get Messages
  socket.on("sendMessage", ({ sender, reciever, text }) => {
    if (sender == null || reciever == null || text == null) return;
    const user = getUserMessages(reciever.userId);
    if (user == null) return;
    console.log(sender);
    io.to(user.socketId).emit("getMessage", {
      sender: sender,
      text: text,
      date: Date.now(),
    });
  });

  //Disconnect user from database
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

// Check for changes in the conversation and send any changes to individuals in the conversation
Conversation.watch(
  [
    {
      $match: {
        operationType: { $in: ["insert", "update", "delete"] },
      },
    },
  ],
  { fullDocument: "updateLookup" }
).on("change", (data) => {
  const connectedUsers = data.fullDocument.participants;
  if (connectedUsers != null) {
    connectedUsers.forEach(function (user, index) {
      const userSocket = getUser(user);
      console.log(user);
      if (userSocket) {
        io.to(userSocket.socketId).emit("get_conversation", {
          _id: data.fullDocument._id,
          name: data.fullDocument.name,
          dateLastMessage: data.fullDocument.dateLastMessage,
          dateCreated: data.fullDocument.dateCreated,
        });
      }
    });
  }
});

const start = async () => {
  try {
    await connectDB(mongoURI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
