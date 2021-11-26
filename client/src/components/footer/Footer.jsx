import { Row, Col } from "react-bootstrap";
import ChatIcon from "@mui/icons-material/Chat";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import "./footer.css";

const Footer = (page) => {
  const navigate = useNavigate();
  return (
    <Row>
      <Col>
        <div
          className="personIcon"
          onClick={() => {
            navigate("/");
          }}
        >
          <ChatIcon
            className="icon"
            style={
              page.page === "home" ? { fill: "#474afe " } : { fill: "grey" }
            }
          />
        </div>
      </Col>

      <Col>
        <div
          className="personIcon"
          onClick={() => {
            navigate("/search");
          }}
        >
          <SearchIcon
            className="icon"
            style={
              page.page === "search" ? { fill: "#474afe " } : { fill: "grey" }
            }
          />
        </div>
      </Col>
      <Col>
        <div
          className="personIcon"
          onClick={() => {
            navigate("/profile");
          }}
        >
          <PersonIcon
            className="icon"
            style={
              page.page === "profile" ? { fill: "#474afe " } : { fill: "grey" }
            }
          />
        </div>
      </Col>
    </Row>
  );
};

export default Footer;
