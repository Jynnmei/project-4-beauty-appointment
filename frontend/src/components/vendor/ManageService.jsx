import React, { useEffect, useState, use } from "react";
import useFetch from "../../hooks/useFetch.jsx";
import UserContext from "../../context/user.jsx";
import "../vendor/ManageService.css";
import ServiceCatalog from "./ServiceCatalog.jsx";

const ManageService = () => {
  const userCtx = use(UserContext);
  console.log("User Context:", userCtx);

  const fetchData = useFetch();

  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userCtx.role !== 2) {
      alert("Access denied. Vendor only.");
      navigate("/manageServices");
    }
  }, [userCtx]);

  // ✅ getAllImages
  const loadImages = async () => {
    const vendor_id = userCtx.user_id;

    setIsLoading(true);
    const res = await fetchData(
      `/api/img/${vendor_id}`,
      "GET",
      undefined,
      userCtx.accessToken
    );

    if (res.ok && Array.isArray(res.data.data)) {
      console.log("Images loaded:", res.data.data);
      setImages(res.data.data);
    } else {
      alert("Failed to load images or response is invalid");
      setImages([]);
    }
    setIsLoading(false);
  };

  // ✅ create Image
  const handleCreate = async (event) => {
    const vendor_id = userCtx.user_id;
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("images", file);
    formData.append("vendor_id", userCtx.user_id);

    const res = await fetchData(
      `/api/img/${vendor_id}`,
      "PUT",
      formData,
      userCtx.accessToken,
      true // multipart
    );

    if (res.ok) {
      alert("Image uploaded!");
      loadImages();
    } else {
      alert("Failed to upload image");
    }

    // Clear the <input type="file"> value so that the same file can be selected again next time.
    event.target.value = "";
  };

  // ✅ update Images
  const handleUpdate = async (event, id) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("images", file);

    const res = await fetchData(
      `/api/img/${id}`,
      "PATCH",
      formData,
      userCtx.accessToken,
      true
    );

    if (res.ok) {
      alert("Image updated!");
      loadImages();
    } else {
      alert("Failed to update image");
    }
  };

  // ✅ delete Images
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    const res = await fetchData(
      `/api/img/${id}`,
      "DELETE",
      undefined,
      userCtx.accessToken
    );

    if (res.ok) {
      alert("Image deleted!");
      loadImages();
    } else {
      alert("Failed to delete image");
    }
  };

  useEffect(() => {
    if (userCtx.user_id) loadImages();
  }, [userCtx.user_id]);

  return (
    <div className="manager-service-container">
      {userCtx.username && (
        <h4 className="welcome">Welcome {userCtx.username}</h4>
      )}
      <h2 className="price-list">Price List Image</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="all-img">
          {images.map((img) => (
            <div key={img.id} className="img-block">
              <img src={img.image_url} alt="vendor-image" className="img" />

              <div className="img-actions">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    handleUpdate(e, img.id);
                    e.target.value = "";
                  }}
                />
                <button
                  onClick={() => handleDelete(img.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <br />
      <div className="upload-section">
        <h4>Upload New Image</h4>
        <input type="file" accept="image/*" onChange={(e) => handleCreate(e)} />
      </div>

      <br />
      <br />
      <ServiceCatalog fetchData={fetchData} accessToken={userCtx.accessToken} />
    </div>
  );
};

export default ManageService;
