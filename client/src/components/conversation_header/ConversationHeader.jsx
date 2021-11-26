import { Row, Col } from "react-bootstrap";
import "./conversationheader.css";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";
const ConversationHeader = (props) => {
  const navigate = useNavigate();
  return (
    <Row className="background-messages-header">
      <Col className="col-2 mt-5">
        <div
          className="back-icon"
          onClick={() => {
            navigate("/");
          }}
        >
          <ArrowBackIosNewIcon />
        </div>
      </Col>
      <Col className="col-10">
        <h1 className="mt-5">{props?.conversationName}</h1>
      </Col>
    </Row>
  );
};

export default ConversationHeader;
