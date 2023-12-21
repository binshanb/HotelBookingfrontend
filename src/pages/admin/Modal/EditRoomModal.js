import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { FaTimes, FaImage, FaTrash } from "react-icons/fa";
import { FcAddImage } from "react-icons/fc";
import { toast } from 'react-toastify';
import axios from 'axios'; // import axios for HTTP requests
import { adminInstance } from "../../../utils/Axios";

export default function EditRoomModal({
  isOpen,
  onRequestClose,
  categories,
  roomData, // Pass the room data to edit
}) {
  const [formError, setFormError] = useState({});
  const [editedRoomData, setEditedRoomData] = useState(roomData); // Set initial room data for editing
  
  const [availableFeatures, setAvailableFeatures] = useState([]);
  
  const handleEditRoom = async (e) => {
    e.preventDefault();
    const errors = validate(editedRoomData);
    setFormError(errors);

    if (Object.keys(errors).length === 0) {
      try {
        const roomFormData = new FormData();
        for (const key in editedRoomData) {
          if (key === 'cover_image' && editedRoomData[key] !== roomData[key]) {
            roomFormData.append(key, editedRoomData[key]);
          } else if (editedRoomData[key] !== roomData[key]) {
            roomFormData.append(key, editedRoomData[key]);
          }
        }

        const response = await adminInstance.put(`booking/admin/edit-room/${editedRoomData.id}`, roomFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          setFormError({});
          onRequestClose();
          showToast('Room updated successfully!', 'success');
        }
      } catch (error) {
        console.error('Error updating room:', error.response.data);
        showToast('Error updating room', 'error');
      }
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setEditedRoomData({ ...roomData, cover_image: file });
  };

  const handleRemoveImage = () => {
    setEditedRoomData({ ...roomData, cover_image: null });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedRoomData({ ...roomData, [name]: value });
  };

  const validate = (roomData) => {
    const errors = {};

    // Perform validation checks here for each field in roomData
    // For example:
    if (!roomData.title) {
      errors.title = "Title is required";
    }
    // Add more validations for other fields...

    return errors;
  };
  const handleCategoryChange = (e) => {
    setEditedRoomData({ ...roomData, category: e.target.value });
  };

  const handleFeatureChange = (e) => {
    const selectedFeatures = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setEditedRoomData({ ...roomData, features: selectedFeatures });
  };
  const showToast = (message, type = 'error') => {
    toast[type](message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  useEffect(() => {
    setEditedRoomData(roomData); // Set room data for editing when it changes
  }, [roomData]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit Room Modal"
      className="custom-modal"
      overlayClassName="custom-overlay "
    >
        <div className="modal-content p-4" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        <div className="header">
          <div className="close-icon" onClick={onRequestClose}>
            <FaTimes className="text-gray-500 hover:text-red-500 cursor-pointer" />
          </div>
        </div>
  
      <h2 className="text-3xl font-bold mt-4">Edit Room</h2>
      <form onSubmit={handleEditRoom}>
      <div className="mt-2">
            <label htmlFor="title" className="block text-gray-700 font-bold">
              Room Name
            </label>
          <input
            type="text"
            placeholder="Title"
            name="title"
            value={roomData.title}
            onChange={handleInputChange}
            className="w-full border rounded p-2 mt-2"
          />
             <span className="text-red-500">
            {formError?.title ? formError.title : ""}
          </span>
          </div>

                    {/* Select dropdown for categories */}
                    <div className="mt-2">
            <label htmlFor="category" className="block text-gray-700 font-bold">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={roomData.category}
              onChange={handleCategoryChange}
              className="w-full border rounded p-2 mt-2"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-2">
            <label htmlFor="capacity" className="block text-gray-700 font-bold">
              Price Per Night
            </label>
          <input
            type="number"
            placeholder="Price per Night"
            name="price_per_night"
            value={roomData.price_per_night}
            onChange={handleInputChange}
            className="w-full border rounded p-2 mt-2"
          />
            </div>
            <div className="mt-2">
            <label htmlFor="capacity" className="block text-gray-700 font-bold">
              Room Size
            </label>
           <input
            type="number"
            placeholder="Room Size"
            name="room_size"
            value={roomData.room_size}
            onChange={handleInputChange}
            className="w-full border rounded p-2 mt-2"
          />
          </div>
               <div className="mt-2">
            <label htmlFor="capacity" className="block text-gray-700 font-bold">
              Capacity
            </label>
            <input
              type="number"
              placeholder="Capacity"
              name="capacity"
              value={roomData.capacity}
              onChange={handleInputChange}
              className="w-full border rounded p-2 mt-2"
            />
          </div>
          <div className="mt-2">
            <label htmlFor="room_slug" className="block text-gray-700 font-bold">
              Room Slug
            </label>
            <input
            type="text"
            placeholder="Room Slug"
            name="room_slug"
            value={roomData.room_slug}
            onChange={handleInputChange}
            className="w-full border rounded p-2 mt-2"
          />
          </div>
          <div className="mt-2">
            <label htmlFor="capacity" className="block text-gray-700 font-bold">
              Description
            </label>
            <textarea
            placeholder="Description"
            name="description"
            value={roomData.description}
            onChange={handleInputChange}
            className="w-full border rounded p-2 mt-2"
          />
          </div>
                  {/* Multi-select dropdown for features */}
                  <div className="mt-4">
            <label htmlFor="features" className="block text-gray-700 font-bold">
              Features
            </label>
            <select
              id="features"
              name="features"
              multiple
              value={roomData.features}
              onChange={handleFeatureChange}
              className="w-full border rounded p-2 mt-2"
            >
              {/* Populate features dynamically */}
              <option value="">Select Features</option>
              {availableFeatures.map(feature => (
                <option key={feature.id} value={feature.id}>
                  {feature.name}
                </option>
              ))}
            </select>
          </div>
          {/* Input field for cover image */}
          <div className="image-input mt-4">
            {roomData.cover_image && roomData.cover_image instanceof Blob ? (
              <div className="image-preview-container">
                <img
                  src={URL.createObjectURL(roomData.cover_image)}
                  alt="Selected Image"
                  className="image-preview"
                />
                <div
                  className="remove-image text-red-500 cursor-pointer"
                  onClick={handleRemoveImage}
                >
                  <FaTrash />
                </div>
              </div>
            ) : (
              <div
                style={{
                  color: "#fff",
                  padding: "8px 12px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                }}
                onClick={() => document.getElementById("roomImage").click()}
              >
                <FcAddImage
                  style={{ marginRight: "5px", height: "100px", width: "100px" }}
                />
                <input
                  type="file"
                  id="roomImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </div>
            )}
          </div>
          <div className="buttonDiv mt-4">
        <button
          type="submit"
          className="add-button bg-blue-500 text-white px-4 py-2 rounded cursor-pointer mx-auto"
        >
          Update
        </button>
        </div>
      </form>
      </div>
    </Modal>
  );
}

