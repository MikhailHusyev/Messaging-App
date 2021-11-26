import { Avatar } from "@mui/material";
import { Row, Col } from "react-bootstrap";
import "./conversation.css";
import Moment from "moment";

const Conversation = (conversation) => {
  return (
    <div className="conversation background-conv">
      <Row>
        <Row>
          <Col className="col-3 avatar-col">
            <Avatar className="mt-4 mx-3">
              {conversation.conversationName?.substring(0, 2).toUpperCase()}
            </Avatar>
          </Col>
          <Col className="col-9">
            <Row>
              <Col>
                <h3 className="mt-2 conversation-name">
                  {conversation.conversationName?.substring(0, 20)}
                </h3>
              </Col>
            </Row>
            <Row>
              <Col>
                <p className="message">
                  {Moment(conversation.lastMessageDate).fromNow()}
                </p>
              </Col>
            </Row>
          </Col>
        </Row>
      </Row>
    </div>
  );
};

export default Conversation;
