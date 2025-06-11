import React, { useEffect, useState, use } from "react";
import useFetch from "../../hooks/useFetch.jsx";
import UserContext from "../../context/user.jsx";

const ViewBooking = () => {
  const userCtx = use(UserContext);
  console.log("User Context:", userCtx);

  const fetchData = useFetch();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userCtx.role !== 2) {
      alert("Access denied. Vendor only.");
      navigate("/manageServices");
    }
  }, [userCtx]);

  const loadAppointments = async () => {
    const vendor_id = userCtx.user_id;
    if (!userCtx.user_id || !userCtx.accessToken) return;

    setLoading(true);
    const res = await fetchData(
      `/api/apptRelation/vendors`,
      "GET",
      undefined,
      userCtx.accessToken
    );

    if (res.ok) {
      console.log("Appointment data:", res.data);
      setAppointments(res.data.vendors || []);
    } else {
      console.error("Failed to load appointments", res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAppointments();
  }, [userCtx.user_id, userCtx.accessToken]);

  if (loading === 0) return <p>Loading your appointments...</p>;
  if (loading) return <p>Loading your appointments...</p>;

  return (
    <div className="my-appointments-container">
      {userCtx.username && (
        <h4 className="welcome">Welcome {userCtx.username}</h4>
      )}
      <h2 className="myAppointments">Client Appointments</h2>

      {Array.isArray(appointments) &&
        appointments.map((appt) => (
          <div key={appt.appointment_id}>
            <p>
              <strong>Date & Time:</strong>{" "}
              {new Date(appt.appointment_datetime).toLocaleString("en-SG", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p>
              <strong>Facial Type:</strong>
              {Array.isArray(appt.types) && appt.types.length > 0
                ? appt.types.join(", ")
                : "N/A"}
            </p>
            <p>
              <strong>Client:</strong> {appt.client}
            </p>
            <p>
              <strong>Client Address:</strong> {appt.client_address}
            </p>
            <p>
              <strong>Phone:</strong> {appt.client_phone}
            </p>
            <p>
              <strong>Service:</strong> {appt.services}
            </p>
            <p>
              <strong>Status:</strong> {appt.status}
            </p>
          </div>
        ))}

      <button className="refreshBtn" onClick={loadAppointments}>
        Refresh
      </button>
    </div>
  );
};

export default ViewBooking;
