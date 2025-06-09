import React, { useEffect, useRef, useState, use } from "react";
import useFetch from "../hooks/useFetch.jsx";
import UserContext from "../context/user.jsx";
import "../components/AppointmentForm.css";

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
  const [priceList, setPriceList] = useState([]);

  const loadDropdownData = async () => {
    console.log("Loading data with token:", userCtx.accessToken);

    const priceRes = await fetchData(
      "/api/img/1",
      "GET",
      undefined,
      userCtx.accessToken
    );
    console.log("Price response:", priceRes);

    const images = priceRes.data?.data || [];
    if (priceRes.ok && images.length > 0) {
      setPriceList(images.map((item) => item.image_url));
    } else {
      console.error("Price list loading failed or empty");
    }

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

  const clearForm = () => {
    if (typeRef.current) typeRef.current.value = "";
    if (vendorRef.current) vendorRef.current.value = "";
    if (serviceRef.current) serviceRef.current.value = "";
    if (dateRef.current) dateRef.current.value = "";
    if (timeRef.current) timeRef.current.value = "";
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
      clearForm();
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
    <div className="appt-container">
      {userCtx.username && (
        <h4 className="welcome">Welcome {userCtx.username}</h4>
      )}
      <h2>Price List</h2>
      <div className="price-list">
        {priceList.length > 0 ? (
          priceList.map((url, idx) => (
            <img key={idx} src={url} alt={`Price List ${idx + 1}`} />
          ))
        ) : (
          <p>Loading Price List...</p>
        )}
      </div>

      <div className="row">
        <h2 className="col-md-6">Appointment Form</h2>
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
              {vendors.map((vendor) => (
                <option key={vendor.user_id} value={vendor.user_id}>
                  {vendor.username}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label>Service</label>
            <select className="form-control" ref={serviceRef}>
              <option value="">Select Service</option>
              {services.map((service) => (
                <option key={service.catalog_id} value={service.catalog_id}>
                  {service.title}
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
