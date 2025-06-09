import React, { useState, use } from "react";
import UserContext from "../context/user.jsx";
import useFetch from "../hooks/useFetch.jsx";
import { jwtDecode } from "jwt-decode";
import "../components/Login.css";

const Login = (props) => {
  const userCtx = use(UserContext);
  const [email, setEmail] = useState("");
  const [hash_password, setHash_Password] = useState("");
  const fetchData = useFetch();

  const handleLogin = async () => {
    const res = await fetchData("/api/auth/login", "POST", {
      email,
      hash_password,
    });

    if (res.ok) {
      userCtx.setAccessToken(res.data.access);
      const decoded = jwtDecode(res.data.access);
      console.log("Decoded JWT payload:", decoded);
      userCtx.setRole(decoded.role_id);

      props.setShowLogin(false);
    } else {
      console.log(res.data);
      alert(JSON.stringify(res.data));
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <input
          className="form-control mb-2"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="form-control mb-2"
          placeholder="password"
          value={hash_password}
          onChange={(e) => setHash_Password(e.target.value)}
        />

        <button className="loginBtn w-100 mb-2" onClick={handleLogin}>
          Login
        </button>

        <button
          className="registerBtn w-100 mb-2"
          onClick={() => props.setShowLogin(false)}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Login;
