import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import UserContext from "./context/user.jsx";
import Login from "./components/users/Login.jsx";
import Registration from "./components/users/Registration.jsx";
import AppointmentForm from "./components/client/AppointmentForm.jsx";
import NavBar from "./NavBar/NavBar.jsx";
import MyAppointments from "./components/client/MyAppointments.jsx";
import ManageService from "./components/vendor/ManageService.jsx";
import NavBarVendor from "./NavBar/NabBarVendor.jsx";

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
          {accessToken && role === 1 && <NavBar />}
          {accessToken && role === 2 && <NavBarVendor />}
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
                {/* Routes for client */}
                {role === 1 && (
                  <>
                    <Route
                      path="/bookAppointment"
                      element={<AppointmentForm />}
                    />
                    <Route
                      path="/myAppointments"
                      element={<MyAppointments />}
                    />
                    <Route
                      path="*"
                      element={<Navigate to="/bookAppointment" />}
                    />
                  </>
                )}

                {/* Routes for vendor */}
                {role === 2 && (
                  <>
                    <Route path="/manageServices" element={<ManageService />} />
                    <Route
                      path="*"
                      element={<Navigate to="/manageServices" />}
                    />
                  </>
                )}
              </>
            )}
          </Routes>
        </Router>
      </UserContext.Provider>
    </>
  );
}

export default App;
