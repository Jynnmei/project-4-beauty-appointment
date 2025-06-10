import React, { useState, useEffect, use } from "react";
import useFetch from "../../hooks/useFetch.jsx";
import UserContext from "../../context/user.jsx";

const ServiceCatalog = () => {
  const userCtx = use(UserContext);
  console.log("User Context:", userCtx);

  const fetchData = useFetch();

  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userCtx.role !== 2) {
      alert("Access denied. Vendor only.");
      navigate("/manageServices");
    }
  }, [userCtx]);

  const loadServices = async () => {
    setIsLoading(true);
    const res = await fetchData(
      "/api/catalog",
      "GET",
      null,
      userCtx.accessToken
    );
    if (res.ok) {
      setServices(res.data);
    } else {
      alert("Failed to load services.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadServices();
  }, []);

  return (
    <>
      <h2 className="price-list">Price List Text</h2>
      {isLoading ? (
        <p>Loading services...</p>
      ) : (
        <ul>
          {services.map((service) => (
            <li key={service.id}>
              <p>Service: {service.title}</p>
              <p>Description: {service.description}</p>
              <p>Price: ${service.price}</p>
              <p>Duration: {service.duration} mins</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default ServiceCatalog;
