import axios from "axios";

export const login = async (user, dispatch) => {
  dispatch({ type: "LOGIN_STARTED" });
  try {
    const baseURI = process.env.REACT_APP_API_BASE_URI;
    const res = await axios.post(baseURI + "/authenticate/login", user);
    dispatch({ type: "LOGIN_SUCCEEDED", payload: res.data });
  } catch (err) {
    dispatch({ type: "LOGIN_FAILED", payload: err });
  }
};
