import React, { useState,useEffect  } from "react";
import Modal from "react-modal";
import { FaTimes, FaImage, FaTrash } from "react-icons/fa";
import { FcAddImage } from "react-icons/fc";
import "./AddCategory.css";
import { toast } from 'react-toastify';
import instance from "../../../utils/Axios";

Modal.setAppElement("#root");

export default function AddRoomModal({
  isOpen,
  onRequestClose,
  onAddRoom,
}) {
  const [formError, setFormError] = useState({});
  const [title, setTitle] = useState("");
  const [pricePerNight, setPricePerNight] = useState(0);
  const [roomSlug, setRoomSlug] = useState(0);
  const [capacity, setCapacity] = useState(0);
  const [roomSize, setRoomSize] = useState(0);
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  console.log(categories,"catttttttttt");
  const [features, setFeatures] = useState([]);
  // const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');


  const [selectedFeatures, setSelectedFeatures] = useState([]);
  

  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Fetch categories and features when the component mounts
    fetchCategories();
    fetchFeatures();
  }, []);



  const handleAddRoom = async (e) => {
    e.preventDefault();
    const errors = validate(title);
    setFormError(errors);

  if (Object.keys(errors).length === 0) {
    try {
      const roomData = new FormData();
      roomData.append('title', title);
      roomData.append('price_per_night', pricePerNight);
      roomData.append('room_slug', roomSlug);
      roomData.append('capacity', capacity);
      roomData.append('room_size', roomSize);
      roomData.append('description', description);
      roomData.append('cover_image', selectedImage);
      


      if (selectedCategory) {
        roomData.append('category', selectedCategory);
      }

      selectedFeatures.forEach((features) => {
        roomData.append('features[]', selectedFeatures);
      });
      

        const response = await onAddRoom(roomData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response === null) {
          setTitle("");
          setPricePerNight(0); 
          setRoomSlug(0);
          setCapacity(0);
          setRoomSize(0);
          setDescription("");
          

          setFormError({});
          setSelectedImage(null);
          onRequestClose();
          // showToast('Room added successfully!', 'success');
        }else{
        const {addedRoom} = response.data;
        if (addedRoom){
          setSelectedCategory(addedRoom.selectedCategory);
          setSelectedFeatures(addedRoom.selectedFeatures);
        }}
    } catch (error) {
        console.error('Error adding room:', error.response?.data);
        // showToast('Error adding room', 'error');
      }
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await instance.get('/api/booking/category-list/');
      console.log(response.data,"resdatttttttttttttt");
      const categoryData = response.data.results;

  
      console.log('Fetched Categories:', categoryData); // Check the structure of categoryData
  
      setCategories(categoryData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  
  const fetchFeatures = async () => {
    try {
      const response = await instance.get('/api/booking/admin/room-feature/');
      const featureData = response.data;
      console.log(featureData,"featuressssss");
      setFeatures(featureData); // Assuming the array of features is directly in response.data
    } catch (error) {
      console.error('Error fetching features:', error);
    }
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const validate = (title) => {
    const errors = {};

    if (!title) {
      errors.title = "Room name is required";
    } else if (title.length < 3) {
      errors.title = "Enter at least 3 characters";
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
      contentLabel="Add Room Modal"
      className="custom-modal w-70 h-70 overflow"
      overlayClassName="custom-overlay"
      style={{
        content: {
          width: '70%',
          height: '70%',
          overflow: 'auto', // or 'scroll' depending on your preference
        },
      }}
    >
      <div className="modal-content p-4">
        <div className="header">
          <div className="close-icon" onClick={onRequestClose}>
            <FaTimes className="text-gray-500 hover:text-red-500 cursor-pointer" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mt-4">Add Room</h2>
        <input
          type="text"
          placeholder="Room Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded p-2 mt-2"
        />
        <span className="text-red-500">
          {formError?.title ? formError.title : ""}
        </span>
        <select
  value={selectedCategory}
  onChange={(e) => {
    setSelectedCategory(e.target.value);
    // setSelectedCategoryId(e.target.value); // Set selectedCategoryId here
  }}
  className="w-full border rounded p-2 mt-2"
>
  <option value="">Select Category</option>
  {categories && categories.map((category) => (
    <option key={category.id} value={category.id}>
      {category.category_name}
    </option>
  ))}
</select>



        <input
          type="text"
          placeholder="Enter Price"
          value={pricePerNight}
          onChange={(e) => setPricePerNight(e.target.value)}
          className="w-full border rounded p-2 mt-2"
        />
        <span className="text-red-500">
          {formError?.title ? formError.title : ""}
        </span>

        <input
          type="text"
          placeholder="Room Slug"
          value={roomSlug}
          onChange={(e) => setRoomSlug(e.target.value)}
          className="w-full border rounded p-2 mt-2"
        />
        <span className="text-red-500">
          {formError?.title ? formError.title : ""}
        </span>
        <input
          type="text"
          placeholder="Enter Capacity"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          className="w-full border rounded p-2 mt-2"
        />
        <span className="text-red-500">
          {formError?.title ? formError.title : ""}
        </span>
        <input
          type="text"
          placeholder="Enter Room Size"
          value={roomSize}
          onChange={(e) => setRoomSize(e.target.value)}
          className="w-full border rounded p-2 mt-2"
        />
        <span className="text-red-500">
          {formError?.title ? formError.title : ""}
        </span>
        <input
          type="text"
          placeholder="Add Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded p-2 mt-2"
        />
        <span className="text-red-500">
          {formError?.title ? formError.title : ""}
        </span>

        <select
  multiple
  value={selectedFeatures}
  onChange={(e) => setSelectedFeatures(Array.from(e.target.selectedOptions, (option) => option.value))}
  className="w-full border rounded p-2 mt-2"
>
  <option value="">Select Features</option>
  {features.map((feature) => (
    <option key={feature.id} value={feature.id}>
      {feature.name}
    </option>
  ))}
</select>

    
        <div className="image-input mt-4">
          {selectedImage ? (
            <div className="image-preview-container">
              <img
                src={URL.createObjectURL(selectedImage)}
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
            onClick={handleAddRoom}
            className="add-button bg-blue-500 text-white px-4 py-2 rounded cursor-pointer mx-auto"
          >
            Add
          </button>
        </div>
      </div>
    </Modal>

  );
};

