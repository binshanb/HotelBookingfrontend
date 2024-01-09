import React, { useState,useEffect  } from "react";
import Modal from "react-modal";
import { FaTimes, FaImage, FaTrash } from "react-icons/fa";
import { FcAddImage } from "react-icons/fc";
import "./AddCategory.css";
import { toast } from 'react-toastify';
import instance, { adminInstance } from "../../../utils/Axios";
 
Modal.setAppElement("#root");

export default function AddRoomModal({
  isOpen,
  onRequestClose,
  onAddRoom,
}) {
  const [formError, setFormError] = useState({});
  const [features, setFeatures] = useState([]);
  console.log(features,":features");
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [title, setTitle] = useState('');
  const [pricePerNight, setPricePerNight] = useState(0);
  const [roomSlug, setRoomSlug] = useState(0);
  const [capacity, setCapacity] = useState(0);
  const [roomSize, setRoomSize] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState({});
  console.log(categories,"categoriesssssss");
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [feature, setFeature] = useState([]);
  const [loadingFeatures, setLoadingFeatures] = useState(true);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handlePriceChange = (e) => setPricePerNight(e.target.value);
  const handleSlugChange = (e) => setRoomSlug(e.target.value);
  const handleCapacityChange = (e) => setCapacity(e.target.value);
  const handleRoomSizeChange = (e) => setRoomSize(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);

  //   // Fetch categories and features when the component mounts
  //   fetchCategories();
  //   fetchFeatures();
  // }, []);



  // const handleAddRoom = async (e) => {
  //   e.preventDefault();
  //   const errors = validate(title);
  //   setFormError(errors);


    

  // if (Object.keys(errors).length === 0) {
  //   try {
  //     const roomData = new FormData();
  //     roomData.append('title', title);
  //     roomData.append('price_per_night', pricePerNight);
  //     roomData.append('room_slug', roomSlug);
  //     roomData.append('capacity', capacity);
  //     roomData.append('room_size', roomSize);
  //     roomData.append('description', description);
  //     roomData.append('cover_image', selectedImage);
      


  //     if (selectedCategory) {
  //       roomData.append('category{}', selectedCategory);
  //     }

  //     selectedFeatures.forEach((features) => {
  //       roomData.append('features[]', selectedFeatures);
  //     });
      

  //       const response = await onAddRoom(roomData, {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       });

  //       if (response === null) {
  //         setTitle("");
  //         setPricePerNight(0); 
  //         setRoomSlug(0);
  //         setCapacity(0);
  //         setRoomSize(0);
  //         setDescription("");
  //         setSelectedCategory({});
  //         setSelectedFeatures([])


  //         setFormError({});
  //         setSelectedImage(null);
  //         onRequestClose();
  //         // showToast('Room added successfully!', 'success');
  //       // }else{
  //       // const {addedRoom} = response.data;
  //       // if (addedRoom){
  //       //   setSelectedCategory(addedRoom.selectedCategory);
  //       //   setSelectedFeatures(addedRoom.selectedFeatures);
  //       // }}
  //  } } catch (error) {
  //       console.error('Error adding room:', error.response?.data);
  //       // showToast('Error adding room', 'error');
  //     }
  //   }
  // };
  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await adminInstance.get('booking/admin/room-category/');
        console.log(response.data,"categorydtaaaaaaaaa");
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
        setLoadingCategories(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLoadingCategories(false);
      }
    };

    // Fetch features
    const fetchFeatures = async () => {
      try {
        const response = await adminInstance.get('booking/admin/room-feature/');
        if (!response.ok) {
          throw new Error('Failed to fetch features');
        }
        const data = await response.json();
        setFeatures(data);
        setLoadingFeatures(false);
      } catch (error) {
        console.error('Error fetching features:', error);
        setLoadingFeatures(false);
      }
    };

    fetchCategories();
    fetchFeatures();
  }, []);

  
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
  const handleAddRoom = () => {

    if (!title || !pricePerNight || !roomSlug || !capacity || !roomSize || !description || !selectedImage) {
  
      setFormError({
        title: !title ? "Title is required" : "",
        pricePerNight: !pricePerNight ? "Price per night is required" : "",
        roomSlug: !roomSlug ? "Room slug is required" : "",
        capacity: !capacity ? "Capacity is required" : "",
        roomSize: !roomSize ? "Room size is required" : "",
        description: !description ? "Description is required" : "",
        selectedImage: !selectedImage ? "Image is required" : "",
      });
      return; // Exit the function if any field is empty
    }
    const addRoom = async (roomData) => {
      try {
        
        const response = await adminInstance.post('booking/admin/add-room/',roomData);
        
        console.log('Room added successfully:', response.data);
        
      } catch (error) {
        
        console.error('Error adding room:', error);
        
      }
    };

  
    addRoom({
      title,
      pricePerNight,
      roomSlug,
      capacity,
      roomSize,
      description,
      selectedImage,
      // Other data you may need to pass for adding a room
    });
  
    // Reset form fields and errors after successfully adding the room
    setTitle('');
    setPricePerNight(0);
    setRoomSlug(0);
    setCapacity(0);
    setRoomSize('');
    setDescription('');
    setSelectedImage(null);
    setFormError({
      title: '',
      pricePerNight: '',
      roomSlug: '',
      capacity: '',
      roomSize: '',
      description: '',
      selectedImage: '',
    });
  
    // Close the modal after adding the room
    onRequestClose();
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
      
      <div>
      {loadingCategories || loadingFeatures ? (
        <p>Loading...</p>
      ) : (
        
      
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
          onChange={handleTitleChange}
          className="w-full border rounded p-2 mt-2"
        />
        <span className="text-red-500">
          {formError?.title ? formError.title : ""}
        </span>
        <div>
            <h3>Categories:</h3>
            <ul>
            {Array.isArray(categories) && categories.map((category) => (
      <li key={category.id}>{category.category_name}</li>
              ))}
            </ul>
          </div>



        <input
          type="text"
          placeholder="Enter Price"
          value={pricePerNight}
          onChange={handlePriceChange}
          className="w-full border rounded p-2 mt-2"
        />
        <span className="text-red-500">
          {formError?.title ? formError.title : ""}
        </span>

        <input
          type="text"
          placeholder="Room Slug"
          value={roomSlug}
          onChange={handleSlugChange}
          className="w-full border rounded p-2 mt-2"
        />
        <span className="text-red-500">
          {formError?.title ? formError.title : ""}
        </span>
        <input
          type="text"
          placeholder="Enter Capacity"
          value={capacity}
          onChange={ handleCapacityChange}
          className="w-full border rounded p-2 mt-2"
        />
        <span className="text-red-500">
          {formError?.title ? formError.title : ""}
        </span>
        <input
          type="text"
          placeholder="Enter Room Size"
          value={roomSize}
          onChange={handleRoomSizeChange}
          className="w-full border rounded p-2 mt-2"
        />
        <span className="text-red-500">
          {formError?.title ? formError.title : ""}
        </span>
        <input
          type="text"
          placeholder="Add Description"
          value={description}
          onChange={handleDescriptionChange}
          className="w-full border rounded p-2 mt-2"
        />
        <span className="text-red-500">
          {formError?.title ? formError.title : ""}
        </span>

        <div>
            <h3>Features:</h3>
            <ul>
              {features.map((feature) => (
                <li key={feature.id}>{feature.name}</li>
              ))}
            </ul>
          </div>
    
    

    
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
        )}
        </div>
      
    
    </Modal>
  
            );
  
  };                                            
