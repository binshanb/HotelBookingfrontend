import React, { useState,useEffect} from "react";
import Modal from "react-modal";
import { FaTimes, FaImage, FaTrash } from "react-icons/fa";
import { FcAddImage } from "react-icons/fc";
import "./AddCategory.css";
import { toast } from 'react-toastify';
import {adminInstance} from "../../../utils/Axios"
Modal.setAppElement("#root");

export default function AddRoomModal({
      isOpen,
      onRequestClose,
      onAddRoom,
    }) {
  const [formError, setFormError] = useState({});
  const [title, setTitle] = useState("");
  const [pricePerNight, setPricePerNight] = useState(0);
  const [capacity, setCapacity] = useState(0);
  const [roomSize, setRoomSize] = useState(0);
  const [description, setDescription] = useState("");
  const [categories,setCategories]=useState([]);
  const [features,setFeatures] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  const handleAddRoom = async (e) => {
    e.preventDefault();
  
    const errors = validate({
      title,
      pricePerNight,
      capacity,
      roomSize,
      description,
    });
  
    setFormError(errors);

    if (Object.keys(errors).length === 0) {
            try {
              const roomData = new FormData();
              roomData.append('title', title);
              roomData.append('price_per_night', pricePerNight);
              roomData.append('capacity', capacity);
              roomData.append('room_size', roomSize);
              roomData.append('description', description);
              roomData.append('cover_image', selectedImage);
              roomData.append('category', selectedCategories);  // If selectedCategory is an object
              roomData.append('features', selectedFeatures); 
            
        
              const response = await onAddRoom(roomData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });


        if (response === null) {
          setTitle("");
          setPricePerNight(0);
          setCapacity(0);
          setRoomSize(0);
          setDescription("");
          setFormError({});
          setSelectedImage(null);
          setSelectedCategories([]);
          setSelectedFeatures([]);
          onRequestClose();
          showToast('Room added successfully!', 'success');
        }
      } catch (error) {
        console.error('Error adding room:', error.response.data);
        showToast('Error adding room', 'error');
      }
    }
  };

  const handleAfterClose = () => {
    setTitle("");
    setPricePerNight(0);
    setCapacity(0);
    setRoomSize(0);
    setDescription("");
    setFormError({});
    setSelectedImage(null);
    setSelectedCategories([]);
    setSelectedFeatures([]);
  };

  useEffect(() => {
    const fetchCategoriesAndFeatures = async () => {
      try {
        const categoriesResponse = await adminInstance.get('booking/admin/room-category/');
        console.log(categoriesResponse,"categoriesssssssss");
        const featuresResponse = await adminInstance.get('booking/admin/room-feature/');
        
        setCategories(categoriesResponse.data);
        setFeatures(featuresResponse.data);
  
        if (!categoriesResponse.ok || !featuresResponse.ok) {
          throw new Error('Failed to fetch categories or features');
        }
      } catch (error) {
        console.error('Error fetching categories or features:', error);
      }
    };
  
    fetchCategoriesAndFeatures();
  }, []);


  const handleCategoryDropdownChange = (e) => {
    // Get the selected value from the dropdown
    const selectedCategory = e.target.value;
  
    // Update the selected categories
    setSelectedCategories((prevSelectedCategories) => {
      // Check if the selected category is already in the list
      const isCategorySelected = prevSelectedCategories.includes(selectedCategory);
  
      // If it's selected, remove it; otherwise, add it
      if (isCategorySelected) {
        return prevSelectedCategories.filter((category) => category !== selectedCategory);
      } else {
        return [...prevSelectedCategories, selectedCategory];
      }
    });
  };


  const handleFeatureDropdownChange = (e) => {
    // Get the selected value from the dropdown
    const selectedFeature = e.target.value;
  
    // Update the selected features
    setSelectedFeatures((prevSelectedFeatures) => {
      // Check if the selected feature is already in the list
      const isFeatureSelected = prevSelectedFeatures.includes(selectedFeature);
  
      // If it's selected, remove it; otherwise, add it
      if (isFeatureSelected) {
        return prevSelectedFeatures.filter((feature) => feature !== selectedFeature);
      } else {
        return [...prevSelectedFeatures, selectedFeature];
      }
    });
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
  
    if (!pricePerNight) {
      errors.pricePerNight = "Price needs to be added";
    }
    if (!capacity) {
      errors.capacity = "Add capacity";
    }
  
    if (!roomSize) {
      errors.roomSize = "Room size is required";
    } 
  
    if (!description) {
      errors.description = "Add description";
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
            onAfterClose={handleAfterClose} 
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
                  {/* Category selection */}
                  <div className="category-selection mt-4">
      <h3>Select Category:</h3>
      <select
        value={selectedCategories}
        onChange={handleCategoryDropdownChange}
        className="w-full border rounded p-2 mt-2"
      >
        <option value="">Select a category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.category_name}
          </option>
        ))}
      </select>
    </div>
            <input
              type="text"
              placeholder="Enter Price"
              value={pricePerNight}
              onChange={(e) => setPricePerNight(e.target.value)}
              className="w-full border rounded p-2 mt-2"
            />
            <span className="text-red-500">
              {formError?.pricePerNight ? formError.pricePerNight : ""}
            </span>
         
            <input
              type="text"
              placeholder="Enter Capacity"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full border rounded p-2 mt-2"
            />
            <span className="text-red-500">
              {formError?.capacity ? formError.capacity : ""}
            </span>
            <input
              type="text"
              placeholder="Enter Room Size"
              value={roomSize}
              onChange={(e) => setRoomSize(e.target.value)}
              className="w-full border rounded p-2 mt-2"
            />
            <span className="text-red-500">
              {formError?.roomSize ? formError.roomSize: ""}
            </span>
            
                  {/* Feature selection */}
                  <div className="feature-selection mt-4">
      <h3>Select Feature:</h3>
      <select
        value={selectedFeatures}
        onChange={handleFeatureDropdownChange}
        className="w-full border rounded p-2 mt-2"
      >
        <option value="">Select a feature</option>
        {features.map((feature) => (
          <option key={feature.id} value={feature.id}>
            {feature.name}
          </option>
        ))}
      </select>
    </div>
            <input
              type="text" 
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded p-2 mt-2"
            />
            <span className="text-red-500">
              {formError?.description ? formError.description : ""}
            </span>
    
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
}

















































// import React, { useState,useEffect  } from "react";
// import Modal from "react-modal";
// import { FaTimes, FaImage, FaTrash } from "react-icons/fa";
// import { FcAddImage } from "react-icons/fc";
// import "./AddCategory.css";
// import { toast } from 'react-toastify';
// import instance, { adminInstance } from "../../../utils/Axios";
 
// Modal.setAppElement("#root");

// export default function AddRoomModal({
//   isOpen,
//   onRequestClose,
//   onAddRoom,
// }) {
//   const [formError, setFormError] = useState({});
//   const [title, setTitle] = useState("");
//   const [pricePerNight, setPricePerNight] = useState(0);
//   const [capacity, setCapacity] = useState(0);
//   const [roomSize, setRoomSize] = useState(0);
//   const [description, setDescription] = useState("");
  
//   const [selectedImage, setSelectedImage] = useState(null);


//   const handleAddRoom = async (e) => {
//     e.preventDefault();
  
//     const errors = validate({
//       title,
//       pricePerNight,
//       capacity,
//       roomSize,
//       description,
//     });
  
//     setFormError(errors);
  
//     if (Object.keys(errors).length === 0) {
//       try {
//         const roomData = new FormData();
//         roomData.append('title', title);
//         roomData.append('pricePerNight', pricePerNight);
//         roomData.append('capacity', capacity);
//         roomData.append('roomSize', roomSize);
//         roomData.append('description', description);
  
//         roomData.append('cover_image', selectedImage);
  
//         const response = await onAddRoom(roomData, {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         });
  
//         if (response === null) {
//           setTitle("");
//           setPricePerNight(0);
//           setCapacity(0);
//           setRoomSize(0);
//           setDescription("");
//           setFormError({});
//           setSelectedImage(null);
//           onRequestClose();
//           showToast('Room added successfully!', 'success');
//         }
//       } catch (error) {
//         console.error('Error adding room:', error.response.data);
//         showToast('Error adding room', 'error');
//       }
//     }
//   };

//   const validate = (title) => {
//     const errors = {};

//     if (!title) {
//       errors.title = "Room name is required";
//     } else if (title.length < 3) {
//       errors.title = "Enter at least 3 characters";
//     }
//     if (!pricePerNight) {
//       errors.pricePerNight = "Price Need to Add";
//     } else if (pricePerNight.length < 3) {
//       errors.pricePerNight = "Enter number";
//     }
//     if (!categoryName) {
//       errors.title = "Room name is required";
//     } else if (title.length < 3) {
//       errors.title = "Enter at least 3 characters";
//     }
//     if (!categoryName) {
//       errors.title = "Room name is required";
//     } else if (title.length < 3) {
//       errors.title = "Enter at least 3 characters";
//     }
//     if (!categoryName) {
//       errors.title = "Room name is required";
//     } else if (title.length < 3) {
//       errors.title = "Enter at least 3 characters";
//     }
//     return errors;
//   };
//   useEffect(() => {
//     // Fetch categories
//     const fetchCategories = async () => {
//       try {
//         const response = await adminInstance.get('booking/admin/room-category/');
//         console.log(response.data,"categorydtaaaaaaaaa");
//         if (!response.ok) {
//           throw new Error('Failed to fetch categories');
//         }
//         const data = await response.json();
//         setCategories(data);
//         setLoadingCategories(false);
//       } catch (error) {
//         console.error('Error fetching categories:', error);
//         setLoadingCategories(false);
//       }
//     };

//     // Fetch features
//     const fetchFeatures = async () => {
//       try {
//         const response = await adminInstance.get('booking/admin/room-feature/');
//         if (!response.ok) {
//           throw new Error('Failed to fetch features');
//         }
//         const data = await response.json();
//         setFeatures(data);
//         setLoadingFeatures(false);
//       } catch (error) {
//         console.error('Error fetching features:', error);
//         setLoadingFeatures(false);
//       }
//     };

//     fetchCategories();
//     fetchFeatures();
//   }, []);


  


//   // const handleAddRoom = () => {

//   //   if (!title || !pricePerNight || !roomSlug || !capacity || !roomSize || !description || !selectedImage) {
  
//   //     setFormError({
//   //       title: !title ? "Title is required" : "",
//   //       pricePerNight: !pricePerNight ? "Price per night is required" : "",
//   //       roomSlug: !roomSlug ? "Room slug is required" : "",
//   //       capacity: !capacity ? "Capacity is required" : "",
//   //       roomSize: !roomSize ? "Room size is required" : "",
//   //       description: !description ? "Description is required" : "",
//   //       selectedImage: !selectedImage ? "Image is required" : "",
//   //     });
//   //     return; // Exit the function if any field is empty
//     // }
//   //   const addRoom = async (roomData) => {
//   //     try {
        
//   //       const response = await adminInstance.post('booking/admin/add-room/',roomData);
        
//   //       console.log('Room added successfully:', response.data);
        
//   //     } catch (error) {
        
//   //       console.error('Error adding room:', error);
        
//   //     }
//   //   };

  
//   //   addRoom({
//   //     title,
//   //     pricePerNight,
//   //     roomSlug,
//   //     capacity,
//   //     roomSize,
//   //     description,
//   //     selectedImage,
//   //     // Other data you may need to pass for adding a room
//   //   });
  
//   //   // Reset form fields and errors after successfully adding the room
//   //   setTitle('');
//   //   setPricePerNight(0);
//   //   setRoomSlug(0);
//   //   setCapacity(0);
//   //   setRoomSize('');
//   //   setDescription('');
//   //   setSelectedImage(null);
//   //   setFormError({
//   //     title: '',
//   //     pricePerNight: '',
//   //     roomSlug: '',
//   //     capacity: '',
//   //     roomSize: '',
//   //     description: '',
//   //     selectedImage: '',
//   //   });
  
//   //   // Close the modal after adding the room
//   //   onRequestClose();
//   // };
  
//   const showToast = (message, type = 'error') => {
//     toast[type](message, {
//       position: toast.POSITION.TOP_RIGHT,
//       autoClose: 3000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//     });

 
// return (
//       <Modal
//         isOpen={isOpen}
//         onRequestClose={onRequestClose}
//         contentLabel="Add Room Modal"
//         className="custom-modal w-70 h-70 overflow"
//         overlayClassName="custom-overlay"
//         style={{
//           content: {
//             width: '70%',
//             height: '70%',
//             overflow: 'auto', // or 'scroll' depending on your preference
//           },
//         }}
//       >
//       <div className="modal-content p-4">
//         <div className="header">
//           <div className="close-icon" onClick={onRequestClose}>
//             <FaTimes className="text-gray-500 hover:text-red-500 cursor-pointer" />
//           </div>
//         </div>
//         <h2 className="text-3xl font-bold mt-4">Add Room</h2>
//         <input
//           type="text"
//           placeholder="Room Name"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="w-full border rounded p-2 mt-2"
//         />
//         <span className="text-red-500">
//           {formError?.title ? formError.title : ""}
//         </span>
//         <input
//           type="text"
//           placeholder="Enter Price"
//           value={pricePerNight}
//           onChange={(e) => setPricePerNight(e.target.value)}
//           className="w-full border rounded p-2 mt-2"
//         />
//         <span className="text-red-500">
//           {formError?.pricePerNight ? formError.pricePerNight : ""}
//         </span>
//         <input
//           type="text"
//           placeholder="Enter Room Slug"
//           value={roomSlug}
//           onChange={(e) => setRoomSlug(e.target.value)}
//           className="w-full border rounded p-2 mt-2"
//         />
//         <span className="text-red-500">
//           {formError?.roomSlug ? formError.roomSlug : ""}
//         </span>
//         <input
//           type="text"
//           placeholder="Enter Capacity"
//           value={capacity}
//           onChange={(e) => setCapacity(e.target.value)}
//           className="w-full border rounded p-2 mt-2"
//         />
//         <span className="text-red-500">
//           {formError?.capacity ? formError.capacity : ""}
//         </span>
//         <input
//           type="text"
//           placeholder="Enter description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           className="w-full border rounded p-2 mt-2"
//         />
//         <span className="text-red-500">
//           {formError?.description ? formError.description : ""}
//         </span>

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
//                 id="categoryImage"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 style={{ display: "none" }}
//               />
//             </div>
//           )}
//         </div>

//         <div className="buttonDiv mt-4">
//           <button
//             onClick={handleAddRoom}
//             className="add-button bg-blue-500 text-white px-4 py-2 rounded cursor-pointer mx-auto"
//           >
//             Add
//           </button>
//         </div>
//       </div>
//     </Modal>
  
//             );
  
//   };     



















  
      
  