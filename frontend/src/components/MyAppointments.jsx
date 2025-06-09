import React, { useEffect, useState, useContext } from "react";
import useFetch from "../hooks/useFetch.jsx";
import UserContext from "../context/user.jsx";

const MyAppointments = () => {
  const userCtx = useContext(UserContext);
  const fetchData = useFetch();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    if (!userCtx.user_id || !userCtx.accessToken) return;

    setLoading(true);
    const res = await fetchData(
      `/api/client/appointment`,
      "GET",
      undefined,
      userCtx.accessToken
    );

    if (res.ok) {
      setAppointments(res.data || []);
    } else {
      console.error("Failed to load appointments", res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAppointments();
  }, [userCtx.user_id, userCtx.accessToken]);

  if (loading) return <p>Loading your appointments...</p>;

  if (appointments.length === 0) return <p>You have no appointments yet.</p>;

  return (
    <div className="my-appointments-container">
      <h2>My Appointments</h2>
      <ul className="appointment-list">
        {appointments.map((appt) => (
          <li key={appt.appointment_id} className="appointment-item">
            <p>
              <strong>Facial Type:</strong> {appt.type_name || appt.type_id}
            </p>
            <p>
              <strong>Vendor:</strong> {appt.vendor_name || appt.vendor_id}
            </p>
            <p>
              <strong>Service:</strong> {appt.service_title || appt.service_id}
            </p>
            <p>
              <strong>Date & Time:</strong>{" "}
              {new Date(appt.appointment_datetime).toLocaleString()}
            </p>
            <p>
              <strong>Status:</strong> {appt.status}
            </p>
          </li>
        ))}
      </ul>

      <button onClick={loadAppointments}>Refresh</button>
    </div>
  );
};

export default MyAppointments;
