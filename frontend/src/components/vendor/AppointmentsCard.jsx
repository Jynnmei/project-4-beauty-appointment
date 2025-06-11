import React from "react";
import { Box } from "@mui/material";
import { Button } from "@mui/material";

const AppointmentCard = ({ appointment, onUpdateStatus }) => {
  return (
    <Box sx={{ p: 2, mb: 1, border: "1px solid #ccc", borderRadius: 2 }}>
      <p>
        <strong>Date & Time:</strong>{" "}
        {new Date(appointment.appointment_datetime).toLocaleString("en-SG", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
      <p>
        <strong>Facial Type:</strong>{" "}
        {Array.isArray(appointment.types) && appointment.types.length > 0
          ? appointment.types.join(", ")
          : "N/A"}
      </p>
      <p>
        <strong>Client:</strong> {appointment.client}
      </p>
      <p>
        <strong>Client Address:</strong> {appointment.client_address}
      </p>
      <p>
        <strong>Phone:</strong> {appointment.client_phone}
      </p>
      <p>
        <strong>Service:</strong>{" "}
        {Array.isArray(appointment.services) && appointment.services.length > 0
          ? appointment.services.join(", ")
          : "N/A"}
      </p>
      <p>
        <strong>Status:</strong> {appointment.status}
      </p>

      {/* PENDING: Confirm + Cancel */}
      {appointment.status === "PENDING" && onUpdateStatus && (
        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            color="success"
            onClick={() => onUpdateStatus(appointment.appointment_id, 2)} // 2 = CONFIRMED
          >
            Confirm
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => onUpdateStatus(appointment.appointment_id, 5)} // 5 = CANCELLED
          >
            Cancel
          </Button>
        </Box>
      )}

      {/* CONFIRMED: Complete + Cancel */}
      {appointment.status === "CONFIRMED" && onUpdateStatus && (
        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            color="success"
            onClick={() => onUpdateStatus(appointment.appointment_id, 3)} // 3 = COMPLETED
          >
            Complete
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => onUpdateStatus(appointment.appointment_id, 5)} // 5 = CANCELLED
          >
            Cancel
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default AppointmentCard;
