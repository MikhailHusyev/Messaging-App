import { useRef, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Footer from "../../components/footer/Footer";
import SearchFeild from "../../components/search/SearchField";
import { TextField } from "@mui/material";
import { io } from "socket.io-client";
import "./search.css";

export const Search = () => {
  const socket = useRef();
  const [users, setFoundUsers] = useState([]);

  // Live socket search to find users that exist
  const searchUser = async (e) => {
    socket.current = io("ws://localhost:8900");
    if (e !== "" && e !== null && e !== []) {
      socket.current.emit("find_user", e);
      socket.current.on("find_user_result", (username) => {
        setFoundUsers(username);
      });
    } else {
      setFoundUsers([]);
    }
  };

  return (
    <Container fluid className="background-color">
      <Row>
        <Col className="mt-5 mx-3">
          <h1 className="header">FIND A FRIEND</h1>
        </Col>
      </Row>
      <Row>
        <Row>
          <Col className="col-8 mt-2 mx-3 mb-3">
            <TextField
              hiddenLabel
              label="Search"
              placeholder="Search by username"
              id="outlined-search"
              type="search"
              onChange={(e) => searchUser(e.target.value)}
              style={{ color: "#474afe" }}
            />
          </Col>
          <Col></Col>
        </Row>
        <div className="my-3">
          {users.map((p) => (
            <Row>
              <Col className="mt-3">
                <SearchFeild username={p?.user_name} />
              </Col>
            </Row>
          ))}
        </div>
      </Row>
      <Row className="sticky-bottom footer">
        <Col>
          <Footer page="search" />
        </Col>
      </Row>
    </Container>
  );
};
