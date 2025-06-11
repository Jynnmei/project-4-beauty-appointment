import React, { useState, useEffect, use } from "react";
import useFetch from "../../hooks/useFetch.jsx";
import UserContext from "../../context/user.jsx";
import ServiceCatalogModal from "./ServiceCatalogModal.jsx";
import ServiceCreateModal from "./ServiceCreateModal.jsx";

const ServiceCatalog = () => {
  const userCtx = use(UserContext);
  console.log("User Context:", userCtx);

  const fetchData = useFetch();

  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userCtx.role !== 2) {
      alert("Access denied. Vendor only.");
      navigate("/manageServices");
    }
  }, [userCtx]);

  // ✅ get services
  const loadServices = async () => {
    setIsLoading(true);
    const res = await fetchData(
      "/api/catalog",
      "GET",
      undefined,
      userCtx.accessToken
    );
    if (res.ok) {
      setServices(res.data);
    } else {
      alert("Failed to load services.");
    }
    setIsLoading(false);
  };

  // ✅ delete services
  const deleteService = async (catalog_id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this service?"
    );
    if (!confirm) return;

    const res = await fetchData(
      `/api/catalog/${catalog_id}`,
      "DELETE",
      undefined,
      userCtx.accessToken
    );

    if (res.ok) {
      alert("Service deleted!");
      loadServices();
    } else {
      alert("Failed to delete service.");
    }
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

              <button
                onClick={() => {
                  setSelectedService(service);
                  setModalMode("edit");
                  setShowModal(true);
                }}
              >
                Edit
              </button>

              <button onClick={() => deleteService(service.catalog_id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={() => {
          setModalMode("create");
          setSelectedService(null);
          setShowModal(true);
        }}
      >
        + Add New Service
      </button>

      {showModal && modalMode === "edit" && selectedService && (
        <ServiceCatalogModal
          title={selectedService.title}
          description={selectedService.description}
          price={selectedService.price}
          duration={selectedService.duration}
          catalog_id={selectedService.catalog_id}
          setShowModal={setShowModal}
          accessToken={userCtx.accessToken}
          loadServices={loadServices}
        />
      )}

      {showModal && modalMode === "create" && (
        <ServiceCreateModal
          setShowModal={setShowModal}
          accessToken={userCtx.accessToken}
          loadServices={loadServices}
        />
      )}
    </>
  );
};

export default ServiceCatalog;
