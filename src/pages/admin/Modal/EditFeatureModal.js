import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { FaTimes, FaTrash } from "react-icons/fa";
import { FcAddImage } from "react-icons/fc";
import "./AddCategory.css";
import { toast } from 'react-toastify';

export default function EditFeatureModal({
  isOpen,
  onRequestClose,
  onUpdateFeature,
  featureData
}) {
  const [formError, setFormError] = useState({});
  const [featureName, setFeatureName] = useState(featureData?.name || "");
 

  useEffect(() => {
    setFeatureName(featureData?.name || "");
    
  }, [featureData]);
 
  const handleUpdateFeature = async (e) => {
    e.preventDefault();
    const errors = validate(featureName);
    setFormError(errors);
    console.log(featureData?.name,'00000000000');
    

    if (Object.keys(errors).length === 0) {
      try {
        const updatedFeatureData = new FormData();
        updatedFeatureData.append('name', featureName);
        ;
        updatedFeatureData.append('featureId', featureData.id);

        const response = await onUpdateFeature(updatedFeatureData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response === null) {
          setFeatureName("");
          setFormError({});
          onRequestClose();
          showToast('Category updated successfully!', 'success');
        }
      } catch (error) {
        console.error('Error updating category:', error.response.data);
        showToast('Error updating category', 'error');
      }
    }
  };

 

 

  const validate = (featureName) => {
    const errors = {};

    if (!featureName) {
      errors.featureName = "Category name is required";
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
      contentLabel="Edit Feature Modal"
      className="custom-modal"
      overlayClassName="custom-overlay"
    >
      <div className="modal-content p-4">
        <div className="header">
          <div className="close-icon" onClick={onRequestClose}>
            <FaTimes className="text-gray-500 hover:text-red-500 cursor-pointer" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mt-4">Edit Features</h2>
        <input
          type="text"
          placeholder="Feature Name"
          value={featureName}
          onChange={(e) => setFeatureName(e.target.value)}
          className="w-full border rounded p-2 mt-2"
        />
        <span className="text-red-500">
          {formError?.featureName ? formError.featureName : ""}
        </span>

       

        <div className="buttonDiv mt-4">
          <button
            onClick={handleUpdateFeature}
            className="add-button bg-blue-500 text-white px-4 py-2 rounded cursor-pointer mx-auto"
          >
            Update
          </button>
        </div>
      </div>
    </Modal>
  );
}



