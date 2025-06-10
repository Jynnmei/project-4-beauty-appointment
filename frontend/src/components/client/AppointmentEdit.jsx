import React, { useState } from "react";

const AppointmentEdit = ({
  appt,
  onUpdate,
  onDelete,
  typeOptions,
  vendorOptions,
  serviceOptions,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    ...appt,
    type_id: String(appt.type_id || ""),
    vendor_id: String(appt.vendor_id || ""),
    service_id: String(appt.service_id || ""),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onUpdate({
      ...editData,
      type_id: parseInt(editData.type_id),
      vendor_id: parseInt(editData.vendor_id),
      service_id: parseInt(editData.service_id),
    });
    setEditMode(false);
  };

  console.log("Type Options:", typeOptions);
  console.log("Vendor Options:", vendorOptions);
  console.log("Service Options:", serviceOptions);

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
              name="type_id"
              value={editData.type_id}
              onChange={handleChange}
            >
              {(typeOptions || []).map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Vendor:
            <select
              name="vendor_id"
              value={editData.vendor_id}
              onChange={handleChange}
            >
              {(vendorOptions || []).map((vendor) => (
                <option key={vendor.user_id} value={vendor.user_id}>
                  {vendor.username}
                </option>
              ))}
            </select>
          </label>

          <label>
            Service:
            <select
              name="service_id"
              value={editData.service_id}
              onChange={handleChange}
            >
              {(serviceOptions || []).map((service) => (
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
            <strong>Facial Type:</strong> {appt.type_name || appt.type_id}
          </p>
          <p>
            <strong>Vendor:</strong> {appt.vendors || appt.vendor_id}
          </p>
          <p>
            <strong>Service:</strong> {appt.services || appt.service_id}
          </p>
          <p>
            <strong>Date & Time:</strong>{" "}
            {new Date(appt.appointment_datetime).toLocaleString()}
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
