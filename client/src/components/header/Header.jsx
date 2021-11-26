import { Row, Col } from "react-bootstrap";
import "./header.css";

const Header = () => {
  return (
    <Row>
      <Col className="background-header ">
        <h1 className="mt-5">Messaging App</h1>
      </Col>
    </Row>
  );
};

export default Header;
