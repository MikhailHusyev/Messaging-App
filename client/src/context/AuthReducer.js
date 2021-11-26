// Reducer used to manage state of login and then set token when user logs in
const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_STARTED":
      return {
        user: null,
        isFetching: true,
        err: false,
      };
    case "LOGIN_SUCCEEDED":
      return {
        user: action.payload,
        isFetching: false,
        err: false,
      };
    case "LOGIN_FAILED":
      return {
        user: null,
        isFetching: false,
        err: true,
      };
    default:
      return state;
  }
};

export default AuthReducer;
