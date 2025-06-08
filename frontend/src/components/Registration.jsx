import React, { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import "../components/Registration.css";

const Registration = (props) => {
  const fetchData = useFetch();
  const [username, setUsername] = useState("");
  const [hash_password, setHash_Password] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role_id, setRoleId] = useState("");
  const [roles, setRoles] = useState([]);

  const getRoles = async () => {
    const res = await fetchData("/api/auth/roles", "GET");
    if (res.ok) {
      setRoles(res.data);
    } else {
      console.error("Failed to fetch roles:", res.data);
    }
  };

  const registerUser = async () => {
    const res = await fetchData("/api/auth/register", "PUT", {
      username,
      hash_password,
      address,
      email,
      phone,
      role_id,
    });

    if (res.ok) {
      setUsername("");
      setHash_Password("");
      setAddress("");
      setEmail("");
      setPhone("");
      setRoleId("");
      alert("user registered");
      props.setShowLogin(true);
    } else {
      console.error(res.data);
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

  return (
    <div className="registration-container">
      <div className="registration-form">
        <input
          className="form-control mb-2"
          placeholder="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="form-control mb-2"
          placeholder="password"
          type="password"
          value={hash_password}
          onChange={(e) => setHash_Password(e.target.value)}
        />
        <input
          className="form-control mb-2"
          placeholder="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="form-control mb-2"
          placeholder="address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          className="form-control mb-2"
          placeholder="phone"
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <select
          className="form-control mb-2"
          value={role_id}
          onChange={(e) => setRoleId(e.target.value)}
        >
          <option value="">Select a role</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
        <button className="register-btn w-100 mb-2" onClick={registerUser}>
          Register
        </button>
        <button
          className="login-btn w-100 mb-2"
          onClick={() => props.setShowLogin(true)}
        >
          Go to login
        </button>
      </div>
    </div>
  );
};

export default Registration;
