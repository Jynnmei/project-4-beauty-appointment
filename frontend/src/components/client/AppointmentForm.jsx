import React, { useEffect, useRef, useState, use } from "react";
import useFetch from "../../hooks/useFetch.jsx";
import UserContext from "../../context/user.jsx";
import "../client/AppointmentForm.css";

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
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (userCtx.role !== 1) {
      alert("Access denied. Clients only.");
      navigate("/bookAppointment");
    }
  }, [userCtx]);

  // Date range: today to 3 months later
  const todayStr = new Date().toISOString().split("T")[0];
  const threeMonthsLater = new Date();
  threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
  const maxDateStr = threeMonthsLater.toISOString().split("T")[0];

  const loadImageData = async () => {
    console.log("Loading data with token:", userCtx.accessToken);

    const priceRes = await fetchData(
      "/api/img/8",
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
      "/api/catalog",
      "GET",
      undefined,
      userCtx.accessToken
    );
    console.log("serviceRes:", serviceRes);
    if (serviceRes.ok) setServices(serviceRes.data);
  };

  const clearForm = () => {
    for (let ref of [typeRef, vendorRef, serviceRef]) {
      if (ref.current) {
        for (let opt of ref.current.options) {
          opt.selected = false;
        }
      }
    }
    if (dateRef.current) dateRef.current.value = "";
    if (timeRef.current) timeRef.current.value = "";
  };

  const getSelectedValues = (ref) =>
    Array.from(ref.current.selectedOptions).map((opt) => parseInt(opt.value));

  const createAppointment = async () => {
    const type_ids = getSelectedValues(typeRef);
    const vendor_ids = getSelectedValues(vendorRef);
    const service_ids = getSelectedValues(serviceRef);
    const date = dateRef.current.value;
    const time = timeRef.current.value;

    if (
      !date ||
      !time ||
      type_ids.length === 0 ||
      vendor_ids.length === 0 ||
      service_ids.length === 0
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const datetime = `${date} ${time}`;
    const client_id = userCtx.user_id;

    const payload = {
      client_id,
      appointment_datetime: datetime,
      type_ids,
      vendor_ids,
      service_ids,
    };

    console.log("Sending appointment:", payload);

    const appointmentRes = await fetchData(
      "/api/appointment",
      "PUT",
      payload,
      userCtx.accessToken
    );

    if (appointmentRes.ok) {
      alert("Appointment created successfully!");
      clearForm();
    } else {
      const msg =
        appointmentRes.data?.msg ||
        "Failed to create appointment. You can only book 2 appointments per month";
      setErrorMsg(msg);

      if (msg === "You can only book 2 appointments per month") {
        alert(msg);
      }
    }
  };

  useEffect(() => {
    if (userCtx.accessToken) {
      console.log("Current access token:", userCtx.accessToken);
      loadImageData();
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
          <input
            type="date"
            className="form-control"
            ref={dateRef}
            min={todayStr}
            max={maxDateStr}
          />
        </div>

        <div className="mb-3">
          <label>Time</label>
          <input type="time" className="form-control" ref={timeRef} />
        </div>

        {errorMsg && <p className="text-danger">{errorMsg}</p>}

        <button className="col-md-3" onClick={createAppointment}>
          Book
        </button>
      </div>
    </div>
  );
};

export default AppointmentForm;
