import React, { useEffect, useState, useContext } from "react";
import useFetch from "../../hooks/useFetch.jsx";
import UserContext from "../../context/user.jsx";
import "../client/MyAppointments.css";
import AppointmentEdit from "./AppointmentEdit.jsx";

const MyAppointments = () => {
  const userCtx = useContext(UserContext);
  const fetchData = useFetch();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeOptions, setTypeOptions] = useState([]);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [serviceOptions, setServiceOptions] = useState([]);

  const loadOptions = async () => {
    const [typesRes, vendorsRes, servicesRes] = await Promise.all([
      fetchData("/api/client/types", "GET", undefined, userCtx.accessToken),
      fetchData("/api/client", "GET", undefined, userCtx.accessToken),
      fetchData("/api/client/service", "GET", undefined, userCtx.accessToken),
    ]);

    if (typesRes.ok) setTypeOptions(typesRes.data);
    if (vendorsRes.ok) setVendorOptions(vendorsRes.data);
    if (servicesRes.ok) setServiceOptions(servicesRes.data);
  };

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
      console.log("Appointment data:", res.data);
      setAppointments(res.data || []);
    } else {
      console.error("Failed to load appointments", res.data);
    }
    setLoading(false);
  };

  const handleUpdate = async (updated) => {
    const res = await fetchData(
      `/api/appointment/${updated.appointment_id}`,
      "PATCH",
      {
        type_id: updated.type_id,
        vendor_id: updated.vendor_id,
        service_id: updated.service_id,
        appointment_datetime: updated.appointment_datetime,
      },
      userCtx.accessToken
    );
    if (res.ok) loadAppointments();
    else alert("Failed to update.");
  };

  const handleDelete = async (appointment_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this appointment?"
    );
    if (!confirmDelete) return;

    const res = await fetchData(
      `/api/appointment/${appointment_id}`,
      "DELETE",
      undefined,
      userCtx.accessToken
    );
    if (res.ok) loadAppointments();
    else alert("Failed to delete.");
  };

  useEffect(() => {
    loadAppointments();
    loadOptions();
  }, [userCtx.user_id, userCtx.accessToken]);

  if (loading) return <p>Loading your appointments...</p>;

  if (appointments.length === 0) return <p>You have no appointments yet.</p>;

  return (
    <div className="my-appointments-container">
      {userCtx.username && (
        <h4 className="welcome">Welcome {userCtx.username}</h4>
      )}
      <h2 className="myAppointments">My Appointments</h2>

      <ul className="appointment-list">
        {appointments.map((appt) => (
          <AppointmentEdit
            key={appt.appointment_id}
            appt={appt}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            typeOptions={typeOptions}
            vendorOptions={vendorOptions}
            serviceOptions={serviceOptions}
          />
        ))}
      </ul>

      <button className="refreshBtn" onClick={loadAppointments}>
        Refresh
      </button>
    </div>
  );
};

export default MyAppointments;
