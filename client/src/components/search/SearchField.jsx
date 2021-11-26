import { useContext, useState } from "react";
import { Avatar, Button } from "@mui/material";
import { Row, Col } from "react-bootstrap";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import CheckIcon from "@mui/icons-material/Check";
import "./searchfield.css";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@mui/material";

import axios from "axios";

const SearchField = (searchUser) => {
  const { user: currentUser } = useContext(AuthContext);
  const [addingState, setAddingState] = useState();
  const baseUri = process.env.REACT_APP_API_BASE_URI;

  //Add a friend to your friends list
  const addFriend = async (e) => {
    e.preventDefault();
    if (currentUser !== null && searchUser !== null) {
      try {
        // Call api to add a friend to your friends list
        await axios.put(
          baseUri + "/user/" + currentUser?.user_name + "/friends",
          { friend: searchUser.username },
          { headers: { "auth-token": currentUser.token } }
        );
        // Call api to add you as friend to other on list
        await axios.put(
          baseUri + "/user/" + searchUser?.username + "/friends",
          { friend: currentUser.user_name },
          { headers: { "auth-token": currentUser.token } }
        );
        setAddingState("added");
      } catch (err) {
        setAddingState("");
      }
    }
  };

  return (
    <div className="search-field">
      <Row className="px-2 py-2">
        <Col className="text-center col-2 ">
          <Avatar className="avatar-col-search">
            {searchUser?.username?.substring(0, 2).toUpperCase()}
          </Avatar>
        </Col>
        <Col className="col-6 text-center">
          <h3 className="mt-2 search-name">
            {searchUser?.username?.substring(0, 20)}
          </h3>
        </Col>
        <Col className="col-4 text-center">
          <Button
            variant="outlined"
            className="add-button"
            startIcon={
              addingState === "added" ? <CheckIcon /> : <AddReactionIcon />
            }
            onClick={addFriend}
            style={
              addingState === "added"
                ? { color: "green", borderColor: "green" }
                : { color: "#474afe", borderColor: "#474afe" }
            }
          >
            {addingState === "adding" ? (
              <CircularProgress size="20px" />
            ) : (
              "Add"
            )}
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <hr className="search-line" />
        </Col>
      </Row>
    </div>
  );
};

export default SearchField;
