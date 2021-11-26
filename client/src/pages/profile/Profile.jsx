import { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Footer from "../../components/footer/Footer";
import "./profile.css";
import { Avatar, Button } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";

export const Profile = () => {
  const { user: currentUser } = useContext(AuthContext);

  // Clears local storage to log user out
  const clickLogOut = (e) => {
    e.preventDefault();
    localStorage.removeItem("user");
    window.location.reload(true);
  };
  return (
    <Container fluid className="background-color">
      <Row>
        <Col className="col-8 offset-2 mt-5 d-flex justify-content-center ">
          <Avatar
            className="profile-avatar"
            sx={{ bgcolor: "#474afe", height: "15vh", width: "15vh" }}
          >
            {currentUser?.user_name?.substring(0, 2).toUpperCase()}
          </Avatar>
        </Col>
      </Row>
      <Row>
        <Col className="col-8 offset-2 mt-3 d-flex justify-content-center ">
          <h3>{currentUser?.user_name}</h3>
        </Col>
      </Row>
      <Row>
        <Col className="col-8 offset-2 mt-3 d-flex justify-content-center ">
          <Button
            variant="outlined"
            color="error"
            type="submit"
            onClick={clickLogOut}
          >
            Log Out
          </Button>
        </Col>
      </Row>
      <Row className="footer">
        <Col>
          <Footer page="profile" />
        </Col>
      </Row>
    </Container>
  );
};
