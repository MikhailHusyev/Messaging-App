import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Avatar } from "@mui/material";
import { Row, Col } from "react-bootstrap";
import "./message.css";
import Moment from "moment";

const Message = (message) => {
  const { user } = useContext(AuthContext);
  return (
    <div className="conversation ">
      <Row>
        <Col className="col-12 text-wrap message-width">
          <p
            className="px-5 py-1 message box"
            style={
              message?.sender === user.user_name
                ? {
                    float: "right",
                    backgroundColor: "#474afe",
                    color: "white",
                  }
                : { float: "left" }
            }
          >
            {message?.text}
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <p
            className="date remove-margin"
            style={
              message?.sender === user.user_name
                ? { float: "right" }
                : { float: "left" }
            }
          >
            {Moment(message?.date).fromNow()}
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <p
            className="sender remove-margin"
            style={
              message?.sender === user.user_name
                ? { float: "right" }
                : { float: "left" }
            }
          >
            {message?.sender}
          </p>
        </Col>
      </Row>
    </div>
  );
};

export default Message;
