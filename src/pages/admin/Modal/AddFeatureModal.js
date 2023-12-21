import React, { useState } from "react";
import Modal from "react-modal";
import { FaTimes } from "react-icons/fa";
import { toast } from 'react-toastify';
import "./AddCategory.css";

const AddFeatureModal = ({ isOpen, onRequestClose, onAddFeature }) => {

  const [formError, setFormError] = useState({});
  const [featureName, setFeatureName] = useState("");

  const handleAddFeature = async (e) => {
    e.preventDefault();
    const errors = validate(featureName);
    setFormError(errors);
    // Add additional validation/error handling as needed
  
  
  if (Object.keys(errors).length === 0) {
    try {
      const featureData = new FormData();
      featureData.append('name', featureName);
    

      const response = await onAddFeature(featureData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response === null) {
        setFeatureName("");
        setFormError({});
        onRequestClose();
        showToast('Feature added successfully!', 'success');
      }
    } catch (error) {
      console.error('Error adding feature:', error.response.data);
      showToast('Error adding feature', 'error');
    }
  }
};
const validate = (featureName) => {
  const errors = {};

  if (!featureName) {
    errors.categoryName = "Feature name is required";
  } else if (featureName.length < 3) {
    errors.featureName = "Enter at least 3 characters";
  }

  return errors;
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
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Feature Modal"
      className="custom-modal"
      overlayClassName="custom-overlay"
    >
      <div className="modal-content p-4">
        <div className="header">
          <div className="close-icon" onClick={onRequestClose}>
            <FaTimes className="text-gray-500 hover:text-red-500 cursor-pointer" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mt-4">Add Feature</h2>
        <input
          type="text"
          placeholder="Feature Name"
          value={featureName}
          onChange={(e) => setFeatureName(e.target.value)}
          className="w-full border rounded p-2 mt-2"
        />
     <div className="buttonDiv mt-4">
          <button
            onClick={handleAddFeature}
            className="add-button bg-blue-500 text-white px-4 py-2 rounded cursor-pointer mx-auto"
          >
            Add
          </button>
        </div>
      </div>
    </Modal>

  );
};

export default AddFeatureModal;


