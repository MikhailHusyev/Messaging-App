import { useRef, useState, useContext, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ConversationFooter from "../../components/conversation_footer/ConversationFooter";
import ConversationHeader from "../../components/conversation_header/ConversationHeader";
import { io } from "socket.io-client";
import Message from "../../components/message/Message";
import "./conversationpage.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useParams } from "react-router-dom";

export const ConversationPage = () => {
  const socket = useRef();
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [incomingMessage, setIncomingMessage] = useState();
  const [currentMessages, setCurrentMessages] = useState([]);
  const [currentConversation, setCurrentConversation] = useState();
  const baseUri = process.env.REACT_APP_API_BASE_URI;
  const header = { headers: { "auth-token": user.token } };
  let { conversationId } = useParams();

  // Anytime a new message is sent get it from socket io
  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setIncomingMessage({
        sender: data.sender,
        message: data.text,
        dateMessage: data.date,
      });
    });
  }, []);

  // Send a new message
  useEffect(() => {
    socket.current.emit("addUser", user.user_name);
    socket.current.on("getUsers", (socketUsers) => {
      setUsers(socketUsers);
    });
  }, [user]);

  const sendMessage = async (e) => {
    if (e.message === "" && e.message === " ") {
      return;
    }
    const date = Date.now();
    let sendMessage = {
      message: e.message,
      sender: user.user_name,
      conversationId: conversationId,
      dateLastMessage: date,
    };

    const reciever = users.find((member) => member.userId !== user.user_name);

    socket.current.emit("sendMessage", {
      sender: user.user_name,
      reciever,
      text: e.message,
    });

    // Post message to mongo database
    try {
      const res = await axios.post(baseUri + "/message", sendMessage, header);
      setCurrentMessages([...currentMessages, res.data]);
      await axios.put(
        baseUri + "/conversation/" + conversationId + "/dateLastMessage",
        { dateLastMessage: date },
        header
      );
    } catch (err) {
      console.log(err);
    }
  };

  // Get a list of already existant messages from mongo db
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(
          baseUri + "/message/" + conversationId,
          header
        );
        setCurrentMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentMessages]);

  // Get current conversation information such as conversation name and date of the most recent message
  // Conversation info will be passed on and displayed
  useEffect(() => {
    const getConversation = async () => {
      try {
        const res = await axios.get(
          baseUri + "/conversation/" + conversationId,
          header
        );
        setCurrentConversation(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversation();
  }, []);

  return (
    <Container fluid className="background-color">
      <Row className="">
        <Col className="conversation-header">
          <ConversationHeader conversationName={currentConversation?.name} />
        </Col>
      </Row>
      <Row className="mb-5 mt-5">
        <Col className="mb-5 mt-5 ">
          <div class="messages">
            {currentMessages.map((m) => (
              <Row>
                <Col className="col-lg-8 offset-lg-2 px-4">
                  <Message
                    text={m.message}
                    sender={m.sender}
                    date={m.dateMessage}
                  />
                </Col>
              </Row>
            ))}
          </div>
        </Col>
      </Row>
      <Row className="sticky-bottom footer">
        <Col>
          <ConversationFooter
            parentCallBack={(e) => sendMessage(e)}
            page="search"
          />
        </Col>
      </Row>
    </Container>
  );
};
