import React, { useState, use } from "react";
import useFetch from "../../hooks/useFetch.jsx";
import UserContext from "../../context/user.jsx";

const AppointmentEdit = ({
  appt,
  onUpdate,
  onDelete,
  typeOptions,
  vendorOptions,
  serviceOptions,
}) => {
  const userCtx = use(UserContext);
  const fetchData = useFetch();

  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    ...appt,
    type_ids: [String(appt.type_id || "")],
    vendor_ids: [String(appt.vendor_id || "")],
    service_ids: [String(appt.catalog_id || "")],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["type_ids", "vendor_ids", "service_ids"].includes(name)) {
      setEditData((prev) => ({
        ...prev,
        [name]: [value],
      }));
    } else {
      setEditData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    const changes = {
      appointment_id: appt.appointment_id,
    };

    // date & time
    if (editData.appointment_datetime) {
      const isoDate = new Date(editData.appointment_datetime).toISOString();
      changes.appointment_datetime = isoDate;
    }

    // type_ids
    if (Array.isArray(editData.type_ids) && editData.type_ids[0] !== "") {
      const ids = editData.type_ids.map((id) => parseInt(id));
      changes.type_ids = ids;
    }

    // vendor_ids
    if (Array.isArray(editData.vendor_ids) && editData.vendor_ids[0] !== "") {
      const ids = editData.vendor_ids.map((id) => parseInt(id));
      changes.vendor_ids = ids;
    }

    // service_ids
    if (Array.isArray(editData.service_ids) && editData.service_ids[0] !== "") {
      const ids = editData.service_ids.map((id) => parseInt(id));
      changes.service_ids = ids;
    }

    console.log(changes);

    try {
      const res = await fetchData(
        `/api/appointment/${appt.appointment_id}`,
        "PATCH",
        changes,
        userCtx.accessToken
      );

      if (!res.ok) throw new Error("Failed to update service: " + res.data);

      await onUpdate(changes);
      setEditMode(false);
    } catch (err) {
      console.error("Failed to save changes:", err);
      alert("Failed to save changes.");
    }
  };

  return (
    <li className="appointment-item">
      {editMode ? (
        <>
          <label>
            Date & Time:
            <input
              type="datetime-local"
              name="appointment_datetime"
              value={editData.appointment_datetime.slice(0, 16)}
              onChange={handleChange}
            />
          </label>

          <label>
            Facial Type:
            <select
              name="type_ids"
              value={editData.type_ids[0] || ""}
              onChange={handleChange}
            >
              {typeOptions.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Vendor:
            <select
              name="vendor_ids"
              value={editData.vendor_ids[0] || ""}
              onChange={handleChange}
            >
              {vendorOptions.map((vendor) => (
                <option key={vendor.user_id} value={vendor.user_id}>
                  {vendor.username}
                </option>
              ))}
            </select>
          </label>

          <label>
            Service:
            <select
              name="service_ids"
              value={editData.service_ids[0] || ""}
              onChange={handleChange}
            >
              {serviceOptions.map((service) => (
                <option key={service.catalog_id} value={service.catalog_id}>
                  {service.title}
                </option>
              ))}
            </select>
          </label>

          <div>
            <button onClick={handleSave}>💾 Save</button>
            <button onClick={() => setEditMode(false)}>❌ Cancel</button>
          </div>
        </>
      ) : (
        <>
          <p>
            <strong>Facial Type:</strong>
            {Array.isArray(appt.types) && appt.types.length > 0
              ? appt.types.join(", ")
              : "N/A"}
          </p>
          <p>
            <strong>Vendor:</strong> {appt.vendors}
          </p>
          <p>
            <strong>Service:</strong> {appt.services}
          </p>
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
            <strong>Status:</strong> {appt.status}
          </p>

          <div>
            <button onClick={() => setEditMode(true)}>✏️ Edit</button>
            <button onClick={() => onDelete(appt.appointment_id)}>
              🗑️ Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
};

export default AppointmentEdit;
