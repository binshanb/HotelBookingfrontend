import React, { useState,useEffect } from "react";
import Modal from "react-modal";
import { FaTimes, FaImage, FaTrash } from "react-icons/fa";
import { FcAddImage } from "react-icons/fc";
import { toast } from 'react-toastify';

import { adminInstance } from "../../../utils/Axios";

export default function AddRoomModal({
  isOpen,
  onRequestClose,
  categories,
}) {
  const [formError, setFormError] = useState({});
  const [roomData, setRoomData] = useState({
    title: "",
    price_per_night: 0,
    capacity: 0,
    room_size: 0,
    cover_image: null,
    description: "",
    room_slug: "",
    category: "", // Add category field
    features: [],// Add features field as an array
    images:[], 
  });
  

  const [availableFeatures, setAvailableFeatures] = useState([]);


  const handleAddRoom = async (e) => {
    e.preventDefault();
    const errors =validate(roomData);
    setFormError(errors);

    if (Object.keys(errors).length === 0) {
      try {
        const roomFormData = new FormData();
        for (const key in roomData) {
          if (key === 'cover_image') {
            roomFormData.append(key, roomData[key]);
          } else {
            roomFormData.append(key, roomData[key]);
          }
        }

        const response = await adminInstance.post('booking/admin/add-room/', roomFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 201) {
          setRoomData({
            title: "",
            price_per_night: 0,
            capacity: 0,
            room_size: 0,
            cover_image: null,
            description: "",
            category: "", // Add category field
            features: [],// Add features field as an array
            images:[],
          });
          setFormError({});
          onRequestClose();
          showToast('Room added successfully!', 'success');
        }
      } catch (error) {
        console.error('Error adding room:', error.response.data);
        showToast('Error adding room', 'error');
      }
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setRoomData({ ...roomData,images:[...roomData.images,...files] });
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...roomData.images];
    updatedImages.splice(index, 1);
    setRoomData({ ...roomData, images: updatedImages });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoomData({ ...roomData, [name]: value });
  };
  const validate = (roomData) => {
    const errors = {};
  
    // Validate category field
    if (!roomData.category || roomData.category.trim() === "") {
      errors.category = "Category is required";
    }
  
    // Validate features field (assuming it's an array)
    if (!roomData.features || roomData.features.length === 0) {
      errors.features = "Features are required";
    }
  
    // Validate cover_image field (assuming it's a file)
    if (!roomData.cover_image || !isFile(roomData.cover_image)) {
      errors.cover_image = "Please select a valid image file for the cover";
    }
  
    return errors;
  };
  
  // Function to check if it's a file
  const isFile = (file) => {
    return file instanceof File || (file instanceof Blob && typeof file.name === 'string');
  };
  const handleSubmit = async () => {
    const errors = validate(roomData);
  
    if (Object.keys(errors).length === 0) {
      try {
        // Proceed with submitting the form or any other action
        // Example: Submit the data to the server using Axios or fetch
        const response = await adminInstance.post('booking/admin/add-room', roomData);
        
        // Handle response
        if (response.status === 201) {
          // Room added successfully, perform necessary actions (e.g., reset form fields, show success message)
          console.log('Room added successfully!');
          // Reset form data or show success message
        }
      } catch (error) {
        console.error('Error adding room:', error);
        // Handle error response from the server (e.g., display error messages)
      }
    } else {
      // Handle validation errors (errors object contains validation error messages)
      console.log('Validation errors:', errors);
    }
  };
  
  const handleCategoryChange = (e) => {
    setRoomData({ ...roomData, category: e.target.value });
  };

  const handleFeatureChange = (e) => {
    const selectedFeatures = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setRoomData({ ...roomData, features: selectedFeatures });
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
    const fetchFeatures = async () => {
      try {
        const response = await adminInstance.get('booking/admin/room-feature/'); // Replace with your actual backend endpoint for fetching features
        if (response.data && Array.isArray(response.data)) {
          setAvailableFeatures(response.data); // Assuming the response is an array of feature objects
        }
      } catch (error) {
        console.error('Error fetching features:', error);
        // Handle error fetching features
      }
    };

    fetchFeatures();
  }, []); 

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Room Modal"
      className="custom-modal"
      overlayClassName="custom-overlay "
    >
      <div className="modal-content p-4" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        <div className="header">
          <div className="close-icon" onClick={onRequestClose}>
            <FaTimes className="text-gray-500 hover:text-red-500 cursor-pointer" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mt-4">Add Room</h2>
        <form onSubmit={handleAddRoom}>
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

          {/* add multiple images  */}

          <div className="mt-4">
        <label htmlFor="roomImages" className="block text-gray-700 font-bold">
          Room Images
        </label>
        <input
          type="file"
          id="roomImages"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="w-full border rounded p-2 mt-2"
        />
      </div>
      <div className="image-input mt-4">
        {roomData.images.map((image, index) => (
          <div key={index} className="image-preview-container">
            <img
              src={URL.createObjectURL(image)}
              alt={`Image ${index + 1}`}
              className="image-preview"
            />
            <div
              className="remove-image text-red-500 cursor-pointer"
              onClick={() => handleRemoveImage(index)}
            >
              <FaTrash />
            </div>
          </div>
        ))}
      </div>
          {/* Input field for cover image */}
          <div className="image-input mt-4">
            {roomData.cover_image ? (
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
              Add
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}




















// import React, { useState } from 'react';
// import Modal from 'react-modal';
// import { FaTimes, FaImage, FaTrash } from "react-icons/fa";
// import { toast } from 'react-toastify';
// import { FcAddImage } from "react-icons/fc";
// import "./AddCategory.css";



// export default function AddRoomModal({
//   isOpen,
//   onRequestClose,
//   onAddRoom,
//   categories,
//   features,
// }) {
//   const [formError, setFormError] = useState({});
//   const [roomName, setRoomName] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [pricePerNight, setPricePerNight] = useState(0);
//   const [capacity, setCapacity] = useState(0);
//   const [roomSize, setRoomSize] = useState(0);
//   const [selectedFeatures, setSelectedFeatures] = useState([]);
//   const [description,setDescription]= useState('')
//   const [roomSlug, setRoomSlug] = useState(''); 

//   const [selectedImage, setSelectedImage] = useState(null);

//   const generateSlug = (title) => {
//     const slug = title.toLowerCase().replace(/\s+/g, '-');
//     return slug;
//   };
  

//   const handleAddRoom = async (e) => {
//     e.preventDefault();
//     const errors = validate(roomName, selectedCategory, pricePerNight, capacity, roomSize,description,selectedFeatures);
//     setFormError(errors);

//     if (Object.keys(errors).length === 0) {
//       try {
//         const roomData = new FormData(); 
//         roomData.append('title',roomName);
//         roomData.append('cover_image', selectedImage);
//         roomData.append('category', selectedCategory);
//         roomData.append('price_per_night', pricePerNight);
//         roomData.append('capacity', capacity);
//         roomData.append('room_size', roomSize);
//         roomData.append('room_slug', roomSlug);
//         roomData.append('features', selectedFeatures);
//         roomData.append('description',description);
      
//         const response = await onAddRoom(roomData, {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         });

//         if (response === null) {

//         // Clear form fields on successful room addition
//         setRoomName('');
//         setSelectedCategory([]);
//         setPricePerNight(0);
//         setCapacity(0);
//         setRoomSize(0);
//         setRoomSlug('')
//         setDescription('');
//         setSelectedFeatures([]);
//         setSelectedImage(null);
//         setFormError({});
//         onRequestClose();
//         showToast('Room added successfully!', 'success');
//       }
//       } catch (error) {
//         console.error('Error adding room:', error);
//         showToast('Error adding room', 'error');
//         // Handle error cases here
//       }
//     }
//   };
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     setSelectedImage(file);
//   };
//   const handleRoomNameChange = (e) => {
//     const newName = e.target.value;
//     setRoomName(newName);
//     const newSlug = generateSlug(newName);
//     setRoomSlug(newSlug);
//   };
  

//   const handleRemoveImage = () => {
//     setSelectedImage(null);
//   };
//   const validate = (roomName, selectedCategory, pricePerNight, capacity, roomSize,description,selectedFeatures) => {
//     const errors = {};

//     if (!roomName || roomName.trim() === '') {
//       errors.roomName = 'Room name is required';
//     } // Add validation checks for other fields

//     if (!selectedCategory || selectedCategory.trim() === '') {
//       errors.selectedCategory = 'Select a category';
//     }

//     if (!pricePerNight || isNaN(pricePerNight) || parseInt(pricePerNight) < 0) {
//       errors.pricePerNight = 'Invalid price, must be a non-negative integer';
//     } else if (!Number.isInteger(parseFloat(pricePerNight))) {
//       errors.pricePerNight = 'Price must be an integer';
//     }
  
//     if (!capacity || isNaN(capacity) || parseInt(capacity) < 0) {
//       errors.capacity = 'Invalid capacity, must be a non-negative integer';
//     } else if (!Number.isInteger(parseFloat(capacity))) {
//       errors.capacity = 'Capacity must be an integer';
//     }
  
//     if (!roomSize || roomSize.trim() === '') {
//       errors.roomSize = 'Room size is required';
//     } else if (!Number.isInteger(parseFloat(roomSize)) || parseInt(roomSize) < 0) {
//       errors.roomSize = 'Invalid room size, must be a non-negative integer';
//     }

// if (!description || description.trim() === '') {
//   errors.description = 'Room Description is required';
// } // Add validation checks for other fields


// };
// const showToast = (message, type = 'error') => {
//   toast[type](message, {
//     position: toast.POSITION.TOP_RIGHT,
//     autoClose: 3000,
//     hideProgressBar: false,
//     closeOnClick: true,
//     pauseOnHover: true,
//     draggable: true,
//     progress: undefined,
//   });
// };
//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onRequestClose}
//       contentLabel="Add Room Modal"
//       className="custom-modal"
//       overlayClassName="custom-overlay"
//     >
//       <div className="modal-content p-2">
//         <div className="header">
//           <div className="close-icon" onClick={onRequestClose}>
//             <FaTimes className="text-gray-500 hover:text-red-500 cursor-pointer" />
//           </div>
//         </div>
//         <h2 className="text-3xl font-bold mt-2">Add Room</h2>
//         <input
//           type="text"
//           placeholder="Room Name"
//           value={roomName}
//           onChange={(e) => setRoomName(e.target.value)}
//           className="w-full border rounded p-2 mt-2"
//         />
//         <span className="text-red-500">
//           {formError?.roomName ? formError.roomName : ''}
//         </span>

//         <div className="category-select mt-2">
//           <select
//             value={selectedCategory}
//             onChange={(e) => setSelectedCategory(e.target.value)}
//           >
//             <option value="">Select Category</option>
//             {categories.map((category) => (
//               <option key={category.id} value={category.id}>
//                 {category.category_name}
//               </option>
//             ))}
//           </select>
//           <span className="text-red-500">
//             {formError?.selectedCategory ? formError.selectedCategory : ''}
//           </span>
//         </div>
//         <input
//           type="text"
//           placeholder="Price Per Night"
//           value={pricePerNight}
//           onChange={(e) => setPricePerNight(e.target.value)}
//           className="w-full border rounded p-2 mt-2"
//         />
//         <span className="text-red-500">
//           {formError?.pricePerNight ? formError.pricePerNight : ''}
//         </span>
//         <input
//           type="text"
//           placeholder="Capacity"
//           value={capacity}
//           onChange={(e) => setCapacity(e.target.value)}
//           className="w-full border rounded p-2 mt-2"
//         />
//         <span className="text-red-500">
//           {formError?.capacity ? formError.capacity : ''}
//         </span>
//         <input
//           type="text"
//           placeholder="Room Size"
//           value={roomSize}
//           onChange={(e) => setRoomSize(e.target.value)}
//           className="w-full border rounded p-2 mt-2"
//         />
//         <span className="text-red-500">
//           {formError?.roomSize ? formError.roomSize : ''}
//         </span>
//         <input
//   type="text"
//   placeholder="Room Slug"
//   value={roomSlug}
//   onChange={(e) => setRoomSlug(e.target.value)}
//   className="w-full border rounded p-2 mt-2"
// />
// <span className="text-red-500">
//   {/* Add validation error message if needed */}
// </span>
//         <input
//           type="text"
//           placeholder="Description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           className="w-full border rounded p-2 mt-2"
//         />
//         <span className="text-red-500">
//           {formError?.description ? formError.description : ''}
//         </span>
  
//         {/* Add checkboxes for selecting features */}
//         <div className="features-select mt-2">
//           <label>Features</label>
//           {Array.isArray(features) &&
//             features.map((feature) => (
//               <label key={feature.id}>
//                 <input
//                   type="checkbox"
//                   value={feature.id}
//                   checked={selectedFeatures.includes(feature.id)}
//                   onChange={(e) =>
//                     e.target.checked
//                       ? setSelectedFeatures([...selectedFeatures, feature.id])
//                       : setSelectedFeatures(selectedFeatures.filter((id) => id !== feature.id))
//                   }
//                 />
//                 {feature.name}
//               </label>
//             ))}
//           <span className="text-red-500">
//             {formError?.selectedFeatures ? formError.selectedFeatures : ''}
//           </span>
//         </div>
//         <div className="image-input mt-4">
//           {selectedImage ? (
//             <div className="image-preview-container">
//               <img
//                 src={URL.createObjectURL(selectedImage)}
//                 alt="Selected Image"
//                 className="image-preview"
//               />
//               <div
//                 className="remove-image text-red-500 cursor-pointer"
//                 onClick={handleRemoveImage}
//               >
//                 <FaTrash />
//               </div>
//             </div>
//           ) : (
//             <div
//               style={{
//                 color: "#fff",
//                 padding: "8px 12px",
//                 borderRadius: "5px",
//                 cursor: "pointer",
//                 display: "inline-flex",
//                 alignItems: "center",
//               }}
//               onClick={() => document.getElementById("roomImage").click()}
//             >
//               <FcAddImage
//                 style={{ marginRight: "5px", height: "100px", width: "100px" }}
//               />
//               <input
//                 type="file"
//                 id="roomImage"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 style={{ display: "none" }}
//               />
//             </div>
//           )}
//         </div>
//         <div className="buttonDiv mt-2">
//           <button
//             onClick={handleAddRoom}
//             className="add-button bg-blue-500 text-white px-3 py-1 rounded cursor-pointer mx-auto"
//           >
//             Add
//           </button>
//         </div>
//       </div>
//     </Modal>
//   );
// }
