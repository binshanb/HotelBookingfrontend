import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { FaTimes, FaTrash } from "react-icons/fa";
import { FcAddImage } from "react-icons/fc";
import "./AddCategory.css";
import { toast } from 'react-toastify';

export default function EditCategoryModal({
  isOpen,
  onRequestClose,
  onUpdateCategory,
  categoryData
}) {
  const [formError, setFormError] = useState({});
  const [categoryName, setCategoryName] = useState(categoryData?.category_name || "");
  const [selectedImage, setSelectedImage] = useState(categoryData?.image || null);

  useEffect(() => {
    setCategoryName(categoryData?.category_name || "");
    setSelectedImage(categoryData?.image || null);
  }, [categoryData]);

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    const errors = validate(categoryName);
    setFormError(errors);
    console.log(categoryData?.image,'00000000000');

    if (Object.keys(errors).length === 0) {
      try {
        const updatedCategoryData = new FormData();
        updatedCategoryData.append('category_name', categoryName);
        updatedCategoryData.append('image', selectedImage);
        updatedCategoryData.append('categoryId', categoryData.id);

        const response = await onUpdateCategory(updatedCategoryData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response === null) {
          setCategoryName("");
          setFormError({});
          setSelectedImage(null);
          onRequestClose();
          showToast('Category updated successfully!', 'success');
        }
      } catch (error) {
        console.error('Error updating category:', error.response.data);
        showToast('Error updating category', 'error');
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const validate = (categoryName) => {
    const errors = {};

    if (!categoryName) {
      errors.categoryName = "Category name is required";
    } else if (categoryName.length < 3) {
      errors.categoryName = "Enter at least 3 characters";
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
      contentLabel="Edit Category Modal"
      className="custom-modal"
      overlayClassName="custom-overlay"
    >
      <div className="modal-content p-4">
        <div className="header">
          <div className="close-icon" onClick={onRequestClose}>
            <FaTimes className="text-gray-500 hover:text-red-500 cursor-pointer" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mt-4">Edit Category</h2>
        <input
          type="text"
          placeholder="Category Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="w-full border rounded p-2 mt-2"
        />
        <span className="text-red-500">
          {formError?.categoryName ? formError.categoryName : ""}
        </span>

        <div className="image-input mt-4">
          {/* Image Preview */}
          {selectedImage ? (
            <div className="image-preview-container" style={{display:"flex",justifyContent:"space-between"}}>
              <img
                src={typeof selectedImage === 'string' ? selectedImage : URL.createObjectURL(selectedImage)}
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
            // Upload Image Button
            <div
              style={{
                color: "#fff",
                padding: "8px 12px",
                borderRadius: "5px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
              }}
              onClick={() => document.getElementById("editCategoryImage").click()}
            >
              <FcAddImage
                style={{ marginRight: "5px", height: "100px", width: "100px" }}
              />
              <input
                type="file"
                id="editCategoryImage"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>
          )}
        </div>

        <div className="buttonDiv mt-4">
          <button
            onClick={handleUpdateCategory}
            className="add-button bg-blue-500 text-white px-4 py-2 rounded cursor-pointer mx-auto"
          >
            Update
          </button>
        </div>
      </div>
    </Modal>
  );
}