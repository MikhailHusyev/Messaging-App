import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/header/Header";

export const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verificationPassword, setVerificiationPassword] = useState("");
  const baseUri = process.env.REACT_APP_API_BASE_URI;
  const navigate = useNavigate();

  let validRegister = true;
  let validPassword = true;
  let errorReason = "";

  // Validate that they enter any text
  if ((username === "" || password === "", verificationPassword === "")) {
    validRegister = false;
  }

  // Validate that password matches verification password
  if (
    password !== "" &&
    verificationPassword !== "" &&
    password !== verificationPassword
  ) {
    validRegister = false;
    validPassword = false;
    errorReason = "Password fields do not match.";
  }

  // Validate password is longer than 6 characters
  if (password !== "" && password.length < 6) {
    validRegister = false;
    validPassword = false;
    errorReason = "Password must be 6 characters long.";
  }

  // Register user
  const clickSubmit = async (e) => {
    if (username === "" || password === "" || verificationPassword === "") {
      validRegister = false;
      errorReason = "Please fillout all the fields.";
    } else {
      try {
        const user = { username: username, password: password };
        await axios.post(baseUri + "/authenticate/register", user);
        navigate("/login");
      } catch (err) {
        if (err !== null) errorReason = "We're having issues signing you up.";
      }
    }
  };

  return (
    <div className="register">
      <Container fluid>
        <Row>
          <Col>
            <Header className="header-login" />
          </Col>
        </Row>
      </Container>

      <Container
        fluid
        className="w-100 justify-content-center vertical-center p-5"
      >
        <Row>
          <Col>
            <h1>Sign Up</h1>
          </Col>
          <form className="loginBox">
            <Col className="mt-2">
              <TextField
                required
                variant="outlined"
                label="Username"
                type="text"
                className="w-100"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Col>
            <Col className="mt-2">
              <TextField
                required
                error={!validPassword}
                variant="outlined"
                placeholder="Password"
                label="Password"
                type="password"
                className="w-100 loginInput"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Col>
            <Col className="mt-2">
              <TextField
                required
                error={!validPassword}
                variant="outlined"
                placeholder="Verify Password"
                label="Verify Password"
                type="password"
                className="w-100 loginInput"
                value={verificationPassword}
                onChange={(e) => setVerificiationPassword(e.target.value)}
              />
            </Col>
            <Col className="mt-2">
              <Button
                variant="outlined"
                className="w-100 loginButton"
                type="button"
                onClick={clickSubmit}
                disabled={!validRegister}
              >
                Sign Up
              </Button>
            </Col>

            <Col>
              {errorReason === "" ? "" : <p className="error">{errorReason}</p>}
            </Col>
          </form>
          <Col className="text-center mt-2">
            <Link className="link" to="/Login">
              Login
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
