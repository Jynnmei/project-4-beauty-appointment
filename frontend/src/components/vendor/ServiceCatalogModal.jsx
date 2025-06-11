import React, { useRef } from "react";
import useFetch from "../../hooks/useFetch.jsx";
import ReactDOM from "react-dom";
import styles from "../vendor/Modal.module.css";

const OverLay = (props) => {
  const fetchData = useFetch();

  const titleRef = useRef();
  const descriptionRef = useRef();
  const priceRef = useRef();
  const durationRef = useRef();

  const updateService = async () => {
    const title = titleRef.current.value.trim();
    const description = descriptionRef.current.value.trim();
    const price = parseFloat(priceRef.current.value);
    const duration = parseInt(durationRef.current.value);

    const updatedData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(!isNaN(price) && { price }),
      ...(!isNaN(duration) && { duration }),
    };

    const res = await fetchData(
      `/api/catalog/${props.catalog_id}`,
      "PATCH",
      updatedData,
      props.accessToken
    );

    if (res.ok) {
      alert("Service updated!");
      props.loadServices();
      props.setShowModal(false);
    } else {
      alert("Failed to update service.");
    }
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h3>Update Service</h3>
        <div className="form-group">
          <label>Service</label>
          <input
            ref={titleRef}
            defaultValue={props.title}
            type="text"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <input
            ref={descriptionRef}
            defaultValue={props.description}
            type="text"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            ref={priceRef}
            defaultValue={props.price}
            type="number"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Duration (mins)</label>
          <input
            ref={durationRef}
            defaultValue={props.duration}
            type="number"
            className="form-control"
          />
        </div>
        <div className="modal-actions">
          <button onClick={updateService}>Update</button>
          <button onClick={() => props.setShowModal(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const ServiceCatalogModal = (props) => {
  return ReactDOM.createPortal(
    <OverLay {...props} />,
    document.querySelector("#modal-root")
  );
};

export default ServiceCatalogModal;
