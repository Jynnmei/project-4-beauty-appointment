import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import UserContext from "./context/user.jsx";
import Login from "./components/Login.jsx";
import Registration from "./components/Registration.jsx";
import AppointmentForm from "./components/AppointmentForm.jsx";
import NavBar from "./NavBar/NavBar.jsx";
import MyAppointments from "./components/MyAppointments.jsx";

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [role, setRole] = useState("");
  const [user_id, setUserId] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [username, setUsername] = useState("");

  // accessToken 变化，尝试解码并提取 user_id 和 role
  useEffect(() => {
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        setUserId(decoded.user_id);
        setRole(decoded.role_id);
      } catch (error) {
        console.error("Failed to decode JWT token:", error);
        setUserId(null);
        setRole("");
      }
    } else {
      setUserId(null);
      setRole("");
    }
  }, [accessToken]);

  return (
    <>
      <UserContext.Provider
        value={{
          accessToken,
          setAccessToken,
          role,
          setRole,
          user_id,
          setUserId,
          username,
          setUsername,
        }}
      >
        <Router>
          {accessToken && <NavBar />}
          <Routes>
            {!accessToken && showLogin && (
              <Route path="*" element={<Login setShowLogin={setShowLogin} />} />
            )}
            {!accessToken && !showLogin && (
              <Route
                path="*"
                element={<Registration setShowLogin={setShowLogin} />}
              />
            )}
            {accessToken && (
              <>
                <Route path="/bookAppointment" element={<AppointmentForm />} />
                <Route path="/myAppointments" element={<MyAppointments />} />
                <Route path="*" element={<Navigate to="/bookAppointment" />} />
              </>
            )}
          </Routes>
        </Router>
        {/* {accessToken.length > 0 && <AppointmentForm />}
        {accessToken.length === 0 && showLogin && (
          <Login setShowLogin={setShowLogin} />
        )}
        {accessToken.length === 0 && !showLogin && (
          <Registration setShowLogin={setShowLogin} />
        )} */}
      </UserContext.Provider>
    </>
  );
}

export default App;
