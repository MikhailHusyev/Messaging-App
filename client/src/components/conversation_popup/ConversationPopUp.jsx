import { Row, Col } from "react-bootstrap";
import "./conversationpopup.css";
import FriendsList from "../friends/FriendsList";
import AddIcon from "@mui/icons-material/Add";
import { TextField, Button } from "@mui/material";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

const ConversationPopUp = (props) => {
  const baseUri = process.env.REACT_APP_API_BASE_URI;
  const { user: currentUser } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);
  const [checkedFriends, checkFriends] = useState([currentUser.user_name]);
  const [chatName, setChatName] = useState();
  const header = { headers: { "auth-token": currentUser.token } };

  // Effect retrieves current users friends list
  useEffect(async () => {
    if (currentUser !== null) {
      try {
        let res = await axios.get(
          baseUri + "/user/" + currentUser?.user_name + "/friends",
          header
        );
        setFriends(res.data.friends);
      } catch (err) {}
    }
  }, []);

  // Handles creating a chat conversation
  const createChat = async (e) => {
    if (e === null) return;
    //body and axios call to create a new conversation
    let body = { participants: checkedFriends, name: chatName };
    await axios.post(baseUri + "/conversation", body, header).then(
      async (res) => {
        let conversationId = res.data.conversationId;
        let bodyForFriends = {
          users: checkedFriends,
          conversationId: conversationId,
        };
        try {
          await axios.put(
            baseUri + "/user/users/conversations/multiple",
            bodyForFriends,
            header
          );
          props.closePane(true);
        } catch (err) {}
      },
      (err) => {}
    );
  };

  // Call back to get friends list from the Friends list component
  const onCallBack = (e) => {
    if (e?.checked === true) {
      checkFriends([...checkedFriends, e?.user]);
    } else {
      let newCheckedFriends = checkedFriends.filter(
        (element) => element !== e?.user
      );
      checkFriends(newCheckedFriends);
    }
  };
  return (
    <div className="popup">
      <Row>
        <Col className="col-6">
          <TextField
            required
            className="f"
            hiddenLabel
            label="Chat Name"
            placeholder="Name your chat"
            id="outlined-search"
            type="search"
            style={{ color: "#474afe", float: "right" }}
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
          />
        </Col>
        <Col className="col-6 text-center ">
          <Button
            className="mt-2"
            variant="outlined"
            style={{ color: "#474afe", borderColor: "#474afe" }}
            endIcon={<AddIcon />}
            onClick={createChat}
          >
            Create
          </Button>
        </Col>
        <Row>
          <Col>
            <hr />
          </Col>
        </Row>
      </Row>
      <Row>
        <Col>
          <h3 className="friends-text">Friends</h3>
        </Col>
      </Row>
      <Row className="scroll">
        {friends.map((p) => (
          <Row>
            <Col className="mt-3">
              <FriendsList username={p} parentCallBack={onCallBack} />
            </Col>
          </Row>
        ))}
      </Row>
    </div>
  );
};

export default ConversationPopUp;
