import React from "react";

const UserContext = React.createContext({
  accessToken: "",
  setAccessToken: () => {},
  role: "",
  setRole: () => {},
  user_id: null,
  setUserId: () => {},
});

export default UserContext;
