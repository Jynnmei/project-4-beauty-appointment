import React, { useState } from "react";
import UserContext from "./context/user.jsx";
import Login from "./components/Login.jsx";
import Registration from "./components/Registration.jsx";
import AppointmentForm from "./components/AppointmentForm.jsx";

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [role, setRole] = useState("");
  const [showLogin, setShowLogin] = useState(true);

  return (
    <>
      <UserContext.Provider
        value={{ accessToken, setAccessToken, role, setRole }}
      >
        {accessToken.length > 0 && <AppointmentForm />}
        {accessToken.length === 0 && showLogin && (
          <Login setShowLogin={setShowLogin} />
        )}
        {accessToken.length === 0 && !showLogin && (
          <Registration setShowLogin={setShowLogin} />
        )}
      </UserContext.Provider>
    </>
  );
}

export default App;
