import React, { useEffect, useRef, useState, use } from "react";
import useFetch from "../hooks/useFetch.jsx";
import UserContext from "../context/user.jsx";

const AppointmentForm = () => {
  const userCtx = use(UserContext);
  console.log("User Context:", userCtx);

  const fetchData = useFetch();

  const typeRef = useRef();
  const vendorRef = useRef();
  const serviceRef = useRef();
  const dateRef = useRef();
  const timeRef = useRef();

  const [types, setTypes] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [services, setServices] = useState([]);

  const loadDropdownData = async () => {
    console.log("Loading data with token:", userCtx.accessToken);
    const typeRes = await fetchData(
      "/api/client/types",
      "GET",
      undefined,
      userCtx.accessToken
    );
    console.log("Types response:", typeRes);
    if (typeRes.ok) setTypes(typeRes.data);

    const vendorRes = await fetchData(
      "/api/client",
      "GET",
      undefined,
      userCtx.accessToken
    );
    if (vendorRes.ok) setVendors(vendorRes.data);

    const serviceRes = await fetchData(
      "/api/client/service",
      "GET",
      undefined,
      userCtx.accessToken
    );
    console.log("serviceRes:", serviceRes);
    if (serviceRes.ok) setServices(serviceRes.data);
  };

  const createAppoitment = async () => {
    const client_id = userCtx.user_id;
    const datetime = `${dateRef.current.value}T${timeRef.current.value}`;

    const res = await fetchData(
      "/api/appointment",
      "PUT",
      {
        client_id,
        type_id: parseInt(typeRef.current.value, 10),
        vendor_id: parseInt(vendorRef.current.value, 10),
        service_id: parseInt(serviceRef.current.value, 10),
        appointment_datetime: datetime,
        status: "pending",
      },
      userCtx.accessToken
    );

    if (res.ok) {
      alert("Appointment created successfully!");
    } else {
      alert(JSON.stringify(res.data));
      console.log(res.data);
    }
  };

  useEffect(() => {
    if (userCtx.accessToken) {
      console.log("Current access token:", userCtx.accessToken);
      loadDropdownData();
    }
  }, [userCtx.accessToken]);

  return (
    <div className="container">
      <div className="row">
        <h1 className="col-md-6">Appointment Form</h1>
      </div>
      {userCtx.role === 1 && (
        <div>
          <div className="mb-3">
            <label>Facial Type</label>
            <select className="form-control" ref={typeRef}>
              <option value="">Select Facial Type</option>
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label>Vendor</label>
            <select className="form-control" ref={vendorRef}>
              <option value="">Select Vendor</option>
              {vendors.map((v) => (
                <option key={v.user_id} value={v.user_id}>
                  {v.username}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label>Service</label>
            <select className="form-control" ref={serviceRef}>
              <option value="">Select Service</option>
              {services.map((s) => (
                <option key={s.catalog_id} value={s.catalog_id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label>Date</label>
            <input type="date" className="form-control" ref={dateRef} />
          </div>

          <div className="mb-3">
            <label>Time</label>
            <input type="time" className="form-control" ref={timeRef} />
          </div>

          <button className="col-md-3" onClick={createAppoitment}>
            Book
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentForm;
