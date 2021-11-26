import { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Container, Row, Col } from "react-bootstrap";
import "./login.css";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { login } from "../../calls/LoginCall";
import CircularProgress from "@mui/material/CircularProgress";
import Header from "../../components/header/Header";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { isFetching, dispatch, err } = useContext(AuthContext);

  // Uses api to log user in using an external axios call
  const clickSubmit = (e) => {
    e.preventDefault();
    login(
      {
        username: username,
        password: password,
      },
      dispatch
    );
  };
  return (
    <div className="login">
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
            <h1>Login</h1>
          </Col>
          <form className="loginBox" onSubmit={clickSubmit}>
            <Col className="mt-2">
              <TextField
                required
                error={err}
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
                error={err}
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
              <Button
                variant="outlined"
                className="w-100 loginButton"
                type="submit"
                disabled={isFetching}
              >
                {isFetching ? <CircularProgress size="20px" /> : "Login"}
              </Button>
            </Col>
            {err ? (
              <Col>
                <p className="error">Please check username or password.</p>
              </Col>
            ) : (
              ""
            )}
          </form>
          <Col className="text-center mt-2">
            <Link className="link" to="/register">
              Sign Up
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
