import { Row, Col } from "react-bootstrap";
import ChatIcon from "@mui/icons-material/Chat";
import { TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import "./conversationfooter.css";

const ConversationFooter = (prop) => {
  const [sendMessage, setSendMessage] = useState("");

  const navigate = useNavigate();
  const callParent = (e) => {
    prop.parentCallBack({ message: sendMessage });
    setSendMessage("");
  };
  return (
    <Row>
      <Col className="text-col col-8 text-center">
        <TextField
          id="outlined-multiline-flexible"
          label="Message"
          multiline
          maxRows={4}
          value={sendMessage}
          onChange={(e) => setSendMessage(e.target.value)}
        />
      </Col>
      <Col className="button-col col-4 mt-2 text-center">
        <Button
          variant="contained"
          style={{ backgroundColor: "#474afe" }}
          endIcon={<SendIcon />}
          onClick={callParent}
        >
          Send
        </Button>
      </Col>
    </Row>
  );
};

export default ConversationFooter;
