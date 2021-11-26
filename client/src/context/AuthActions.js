export const LoginStart = (userCredentials) => ({
  type: "LOGIN_STARTED",
});

export const LoginSuccess = (user) => ({
  type: "LOGIN_SUCCEEDED",
  payload: user,
});

export const LoginFailure = () => ({
  type: "LOGIN_FAIED",
});
