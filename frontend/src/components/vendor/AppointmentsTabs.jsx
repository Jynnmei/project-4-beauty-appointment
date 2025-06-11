import React, { useEffect, useState, use } from "react";
import useFetch from "../../hooks/useFetch.jsx";
import UserContext from "../../context/user.jsx";

import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import AppointmentCard from "./AppointmentsCard.jsx";

const CustomTabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index} // 只有当前 tab 的 index 匹配时才显示
      id={`tab-panel-${index}`} // 唯一 id
      aria-labelledby={`tab-${index}`} // 指向对应的 <Tab> 的 id
      {...other} // 允许额外的 props 传入
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

// 生成每个 <Tab> 所需的 id 和 aria-controls，用来跟 <CustomTabPanel> 中的 aria-labelledby 一一对应
const a11yProps = (index) => ({
  id: `tab-${index}`,
  "aria-controls": `tab-panel-${index}`,
});

const Appointments = () => {
  const userCtx = use(UserContext);
  const fetchData = useFetch();

  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const statusIdMap = {
    1: "PENDING",
    2: "CONFIRMED",
    3: "COMPLETED",
    4: "CANCELLED",
  };

  const [appointments, setAppointments] = useState({
    PENDING: [],
    CONFIRMED: [],
    COMPLETED: [],
    CANCELLED: [],
  });

  useEffect(() => {
    if (userCtx.role !== 2) {
      alert("Access denied. Vendor only.");
      navigate("/manageServices");
    }
  }, [userCtx]);

  const fetchAppointments = async () => {
    const vendor_id = userCtx.user_id;
    try {
      const res = await fetchData(
        `/api/vendor/${vendor_id}`,
        "GET",
        undefined,
        userCtx.accessToken
      );

      if (res.ok) {
        console.log("res.data", res.data);
        const grouped = {
          PENDING: [],
          CONFIRMED: [],
          COMPLETED: [],
          CANCELLED: [],
        };

        for (const statusKey in res.data.data) {
          if (grouped.hasOwnProperty(statusKey)) {
            grouped[statusKey] = res.data.data[statusKey];
          }
        }

        setAppointments(grouped);
      } else {
        console.error("Failed to load appointments", res.data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [userCtx.user_id]);

  const handleStatusUpdate = async (appointmentId, newStatusId) => {
    try {
      const res = await fetchData(
        `/api/status/${appointmentId}`,
        "PATCH",
        { status_id: newStatusId },
        userCtx.accessToken
      );

      if (res.ok) {
        await fetchAppointments();
      } else {
        console.error("Failed to update:", res.data?.msg);
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  return (
    <Box sx={{ width: "100%", bgcolor: "#f0f4f8", borderRadius: 2 }}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="fullWidth"
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="vendor status tabs"
        sx={{
          backgroundColor: "#fff",
          borderRadius: 2,
          "& .MuiTab-root": {
            fontWeight: "bold",
          },
        }}
      >
        <Tab label="PENDING" {...a11yProps(0)} />
        <Tab label="CONFIRMED" {...a11yProps(1)} />
        <Tab label="COMPLETED" {...a11yProps(2)} />
        <Tab label="CANCELLED" {...a11yProps(3)} />
      </Tabs>

      <CustomTabPanel value={value} index={0}>
        {appointments.PENDING.map((appt) => (
          <AppointmentCard
            key={appt.appointment_id}
            appointment={appt}
            onUpdateStatus={handleStatusUpdate}
          />
        ))}
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        {appointments.CONFIRMED.map((appt) => (
          <AppointmentCard
            key={appt.appointment_id}
            appointment={appt}
            onUpdateStatus={handleStatusUpdate}
          />
        ))}
      </CustomTabPanel>

      <CustomTabPanel value={value} index={2}>
        {appointments.COMPLETED.map((appt) => (
          <AppointmentCard key={appt.appointment_id} appointment={appt} />
        ))}
      </CustomTabPanel>

      <CustomTabPanel value={value} index={3}>
        {appointments.CANCELLED.map((appt) => (
          <AppointmentCard key={appt.appointment_id} appointment={appt} />
        ))}
      </CustomTabPanel>
    </Box>
  );
};

export default Appointments;
