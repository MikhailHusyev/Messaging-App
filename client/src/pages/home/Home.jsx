import { Container, Row, Col } from "react-bootstrap";
import { useState, useContext, useEffect, useRef } from "react";
import Conversation from "../../components/conversation/Conversation";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { IconButton } from "@mui/material";
import AddCommentIcon from "@mui/icons-material/AddComment";
import ConversationPopUp from "../../components/conversation_popup/ConversationPopUp";
import "react-sliding-pane/dist/react-sliding-pane.css";
import { io } from "socket.io-client";
import SlidingPane from "react-sliding-pane";
import { AuthContext } from "../../context/AuthContext";
import "./home.css";
import axios from "axios";
import Moment from "moment";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const { user } = useContext(AuthContext);
  const socket = useRef();
  const navigate = useNavigate();
  const baseUri = process.env.REACT_APP_API_BASE_URI;
  const [currentConversations, setConversations] = useState([]);
  const [tempConversations, setTempConversations] = useState();
  const [newConversation, setNewConversation] = useState(null);
  const [state, setState] = useState({
    isPaneOpen: false,
  });
  const { user: currentUser } = useContext(AuthContext);
  const header = { headers: { "auth-token": currentUser.token } };

  // Sort Conversations by most recent date
  function sortInputByDate(result) {
    const sorted = result.sort(
      (a, b) => Moment(b.dateLastMessage) - Moment(a.dateLastMessage)
    );
    return sorted;
  }

  //Get initial list of conversations based on username
  useEffect(() => {
    async function getResult() {
      let conversationIds = await axios.get(
        baseUri + "/user/" + user.user_name + "/conversations",
        header
      );
      let body = { conversations: conversationIds.data.conversations };
      try {
        let result = await axios.post(
          baseUri + "/conversation/conversations",
          body,
          header
        );
        setConversations(sortInputByDate(result.data.conversations));
      } catch (error) {}
    }
    getResult();
  }, []);

  //If conversation gets updated get any updates from socket io
  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.emit("connect_user", user.user_name);
  }, [user]);
  useEffect(() => {
    socket.current.on("get_conversation", (data) => {
      setNewConversation(data);
    });
  }, []);

  // The effect handles when a new conversation is created:
  // If a new conversation is created first a check is run to see if it's already in the list
  // If conversation is in the list then update its values
  // If not add conversation to list
  useEffect(() => {
    if (newConversation === null) return;
    // Check by conversation id to see if it's in list
    let index = currentConversations.findIndex(
      (x) => x._id == newConversation._id
    );
    if (index > -1) {
      //if conversation is in list update its values
      let updatedConversation = currentConversations.filter(
        (conv) => conv._id !== newConversation._id
      );
      updatedConversation.push(newConversation);
      setConversations(sortInputByDate(updatedConversation));
    } else {
      //if conversation is not in list add it to list
      setConversations((prev) => sortInputByDate([...prev, newConversation]));
    }
  }, [tempConversations, newConversation]);

  return (
    <Container fluid className="background-color">
      <Row>
        <Col className="col-lg-12">
          <SlidingPane
            closeIcon={
              <KeyboardArrowDownIcon
                style={{ color: "#474afe", width: "1.5em", height: "1.5em" }}
              />
            }
            title="Create Chat"
            from="bottom"
            width="100%"
            onRequestClose={() => {
              setState({ isPaneOpen: false });
            }}
            isOpen={state.isPaneOpen}
          >
            <ConversationPopUp
              closePane={() => {
                setState({ isPaneOpen: false });
              }}
            />
          </SlidingPane>
        </Col>
      </Row>
      <Row>
        <Col className="col-lg-12">
          <Header />
        </Col>
      </Row>
      <Row>
        <Col></Col>
      </Row>
      <Row className="mb-5">
        <Col className="mb-5">
          {currentConversations.map((p) => (
            <Row key={p._id} className="mt-3">
              <Col className="col-lg-8 offset-lg-2 px-4">
                <div
                  class="Click"
                  onClick={() => {
                    navigate("/conversation/" + p._id);
                  }}
                >
                  <Conversation
                    conversationName={p.name}
                    lastMessageDate={p.dateLastMessage}
                  />
                </div>
              </Col>
            </Row>
          ))}
        </Col>
      </Row>
      <Row className="new-chat">
        <Col className="col-2 offset-8 px-4">
          <IconButton
            variant="contained"
            style={{ backgroundColor: "#474afe", color: "white" }}
            shape="round"
            className="add-conversation-button"
            onClick={() => {
              setState({ isPaneOpen: true });
            }}
          >
            <AddCommentIcon />
          </IconButton>
        </Col>
      </Row>

      <Row className="footer">
        <Col>
          <Footer page="home" />
        </Col>
      </Row>
    </Container>
  );
};
