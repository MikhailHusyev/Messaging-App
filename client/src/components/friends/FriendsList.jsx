import { Avatar, Checkbox } from "@mui/material";
import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import "./friendslist.css";

const FriendsList = (props) => {
  const [checked, setChecked] = useState(true);

  const onChecked = (e) => {
    setChecked(!checked);
    props.parentCallBack({ user: props.username, checked: checked });
  };
  return (
    <div className="search-field">
      <Row>
        <Col>
          <Avatar>MI</Avatar>
        </Col>
        <Col>
          <h3 className="mt-2 search-name">{props?.username}</h3>
        </Col>
        <Col>
          <Checkbox onChange={onChecked} />
        </Col>
      </Row>
    </div>
  );
};

export default FriendsList;
