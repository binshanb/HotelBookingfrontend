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
  onUpdateRoom,
  roomData, // Pass the room data to edit
}) {
  const [formError, setFormError] = useState({});
  const [title, setTitle] = useState(roomData?.title || "");
  const [pricePerNight, setPricePerNight] = useState(roomData?.price_per_night || 0);
  const [roomSlug, setRoomSlug] = useState(roomData?.room_slug || 0);
  const [capacity, setCapacity] = useState(roomData?.capacity || 0);
  const [roomSize, setRoomSize] = useState(roomData?.room_size || 0);
  const [description, setDescription] = useState(roomData?.description || "");

  const [selectedImage, setSelectedImage] = useState(roomData?.cover_image || null);
  const [editedRoomData, setEditedRoomData] = useState(roomData); // Set initial room data for editing
  console.log(editedRoomData,"edittttt");
  
  const [availableFeatures, setAvailableFeatures] = useState([]);
  console.log(availableFeatures,"available");
  const [categories,setCategories]=useState([]);

  useEffect(() => {
    setTitle(roomData?.title || "");
    setPricePerNight(roomData?.price_per_night || 0);
    setRoomSlug(roomData?.room_slug || 0);
    setCapacity(roomData?.capacity || 0);
    setRoomSize(roomData?.room_size || 0);
    setDescription(roomData?.description || "");
    setSelectedImage(roomData?.cover_image || null);
  }, [roomData]);
 

  useEffect(() => {
    // Fetch categories and set the state
    const fetchCategories = async () => {
      try {
        // Make an API call to get categories
        const response = await adminInstance.get('booking/admin/room-category');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    // Fetch available features and set the state
    const fetchAvailableFeatures = async () => {
      try {
        // Make an API call to get available features
        const response = await adminInstance.get('booking/admin/room-feature');
        setAvailableFeatures(response.data);
      } catch (error) {
        console.error('Error fetching available features:', error);
      }
    };

    fetchCategories(); // Fetch categories data
    fetchAvailableFeatures(); // Fetch available features data
  }, []);
  
  const handleEditRoom = async (e) => {
    e.preventDefault();
    const errors = validate(editedRoomData);
    setFormError(errors);
    console.log(roomData?.cover_image,'00000000000');
    if (Object.keys(errors).length === 0) {
      try {
        const updatedRoomData = new FormData();
        updatedRoomData.append('title', title);
        updatedRoomData.append('price_per_night', pricePerNight);
        updatedRoomData.append('room_slug', roomSlug);
        updatedRoomData.append('capacity', capacity);
        updatedRoomData.append('room_size',roomSize);
        updatedRoomData.append('description', description);
        updatedRoomData.append('title', title);


        updatedRoomData.append('image', selectedImage);
        

        const response = await onUpdateRoom(updatedRoomData, {
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
          setDescription("")
          setFormError({});
          setSelectedImage(null);
          onRequestClose();
          showToast('Room updated successfully!', 'success');
        }
        }catch (error) {
        console.error('Error updating room:', error.response.data);
        showToast('Error updating room', 'error');
      }
    }
  };



  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    setEditedRoomData({ ...roomData, cover_image: file });
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
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
           placeholder="Room Name"
           name="title"
           value={editedRoomData ? editedRoomData.title : ''}
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
          value={roomData && roomData.category ? roomData.category : ''}
          onChange={handleCategoryChange}
          className="w-full border rounded p-2 mt-2"
             >
              <option value="">Select Category</option>
              {categories && Array.isArray(categories) && categories.map((category) => (
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
            value={editedRoomData ? editedRoomData.price_per_night: ''}
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
            value={editedRoomData ? editedRoomData.room_size: ''}
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
              value={editedRoomData ? editedRoomData.capacity: ''}
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
            value={editedRoomData ? editedRoomData.room_slug: ''}
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
            value={editedRoomData ? editedRoomData.description: ''}
            onChange={handleInputChange}
            className="w-full border rounded p-2 mt-2"
          />
          </div>
                  {/* Multi-select dropdown for features */}
                  
  {roomData && roomData.features && (
  <div className="mt-4">
    <label htmlFor="features" className="block text-gray-700 font-bold">
      Features
    </label>
    <select
      id="features"
      name="features"
      multiple
      value={roomData.features || []}
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
)}

          {/* Input field for cover image */}
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





























// import React, { useState, useEffect } from "react";
// import Modal from "react-modal";
// import { FaTimes, FaImage, FaTrash } from "react-icons/fa";
// import { FcAddImage } from "react-icons/fc";
// import { toast } from 'react-toastify';
// import axios from 'axios'; // import axios for HTTP requests
// import { adminInstance } from "../../../utils/Axios";

// export default function EditRoomModal({
//   isOpen,
//   onRequestClose,
//   categories,
//   roomData, // Pass the room data to edit
// }) {
//   const [formError, setFormError] = useState({});
//   const [editedRoomData, setEditedRoomData] = useState(roomData); // Set initial room data for editing
  
//   const [availableFeatures, setAvailableFeatures] = useState([]);
  
//   const handleEditRoom = async (e) => {
//     e.preventDefault();
//     const errors = validate(editedRoomData);
//     setFormError(errors);

//     if (Object.keys(errors).length === 0) {
//       try {
//         const roomFormData = new FormData();
//         for (const key in editedRoomData) {
//           if (key === 'cover_image' && editedRoomData[key] !== roomData[key]) {
//             roomFormData.append(key, editedRoomData[key]);
//           } else if (editedRoomData[key] !== roomData[key]) {
//             roomFormData.append(key, editedRoomData[key]);
//           }
//         }

//         const response = await adminInstance.put(`booking/admin/edit-room/${editedRoomData.id}`, roomFormData, {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         });

//         if (response.status === 200) {
//           setFormError({});
//           onRequestClose();
//           showToast('Room updated successfully!', 'success');
//         }
//       } catch (error) {
//         console.error('Error updating room:', error.response.data);
//         showToast('Error updating room', 'error');
//       }
//     }
//   };
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     setEditedRoomData({ ...roomData, cover_image: file });
//   };

//   const handleRemoveImage = () => {
//     setEditedRoomData({ ...roomData, cover_image: null });
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditedRoomData({ ...roomData, [name]: value });
//   };

//   const validate = (roomData) => {
//     const errors = {};

//     // Perform validation checks here for each field in roomData
//     // For example:
//     if (!roomData.title) {
//       errors.title = "Title is required";
//     }
//     // Add more validations for other fields...

//     return errors;
//   };
//   const handleCategoryChange = (e) => {
//     setEditedRoomData({ ...roomData, category: e.target.value });
//   };

//   const handleFeatureChange = (e) => {
//     const selectedFeatures = Array.from(
//       e.target.selectedOptions,
//       (option) => option.value
//     );
//     setEditedRoomData({ ...roomData, features: selectedFeatures });
//   };
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
//   };
//   useEffect(() => {
//     setEditedRoomData(roomData); // Set room data for editing when it changes
//   }, [roomData]);

//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onRequestClose}
//       contentLabel="Edit Room Modal"
//       className="custom-modal"
//       overlayClassName="custom-overlay "
//     >
//         <div className="modal-content p-4" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
//         <div className="header">
//           <div className="close-icon" onClick={onRequestClose}>
//             <FaTimes className="text-gray-500 hover:text-red-500 cursor-pointer" />
//           </div>
//         </div>
  
//       <h2 className="text-3xl font-bold mt-4">Edit Room</h2>
//       <form onSubmit={handleEditRoom}>
//       <div className="mt-2">
//             <label htmlFor="title" className="block text-gray-700 font-bold">
//               Room Name
//             </label>
//           <input
//             type="text"
//             placeholder="Title"
//             name="title"
//             value={roomData.title}
//             onChange={handleInputChange}
//             className="w-full border rounded p-2 mt-2"
//           />
//              <span className="text-red-500">
//             {formError?.title ? formError.title : ""}
//           </span>
//           </div>

//                     {/* Select dropdown for categories */}
//                     <div className="mt-2">
//             <label htmlFor="category" className="block text-gray-700 font-bold">
//               Category
//             </label>
//             <select
//               id="category"
//               name="category"
//               value={roomData.category}
//               onChange={handleCategoryChange}
//               className="w-full border rounded p-2 mt-2"
//             >
//               <option value="">Select Category</option>
//               {categories.map((category) => (
//                 <option key={category.id} value={category.id}>
//                   {category.category_name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="mt-2">
//             <label htmlFor="capacity" className="block text-gray-700 font-bold">
//               Price Per Night
//             </label>
//           <input
//             type="number"
//             placeholder="Price per Night"
//             name="price_per_night"
//             value={roomData.price_per_night}
//             onChange={handleInputChange}
//             className="w-full border rounded p-2 mt-2"
//           />
//             </div>
//             <div className="mt-2">
//             <label htmlFor="capacity" className="block text-gray-700 font-bold">
//               Room Size
//             </label>
//            <input
//             type="number"
//             placeholder="Room Size"
//             name="room_size"
//             value={roomData.room_size}
//             onChange={handleInputChange}
//             className="w-full border rounded p-2 mt-2"
//           />
//           </div>
//                <div className="mt-2">
//             <label htmlFor="capacity" className="block text-gray-700 font-bold">
//               Capacity
//             </label>
//             <input
//               type="number"
//               placeholder="Capacity"
//               name="capacity"
//               value={roomData.capacity}
//               onChange={handleInputChange}
//               className="w-full border rounded p-2 mt-2"
//             />
//           </div>
//           <div className="mt-2">
//             <label htmlFor="room_slug" className="block text-gray-700 font-bold">
//               Room Slug
//             </label>
//             <input
//             type="text"
//             placeholder="Room Slug"
//             name="room_slug"
//             value={roomData.room_slug}
//             onChange={handleInputChange}
//             className="w-full border rounded p-2 mt-2"
//           />
//           </div>
//           <div className="mt-2">
//             <label htmlFor="capacity" className="block text-gray-700 font-bold">
//               Description
//             </label>
//             <textarea
//             placeholder="Description"
//             name="description"
//             value={roomData.description}
//             onChange={handleInputChange}
//             className="w-full border rounded p-2 mt-2"
//           />
//           </div>
//                   {/* Multi-select dropdown for features */}
//                   <div className="mt-4">
//             <label htmlFor="features" className="block text-gray-700 font-bold">
//               Features
//             </label>
//             <select
//               id="features"
//               name="features"
//               multiple
//               value={roomData.features}
//               onChange={handleFeatureChange}
//               className="w-full border rounded p-2 mt-2"
//             >
//               {/* Populate features dynamically */}
//               <option value="">Select Features</option>
//               {availableFeatures.map(feature => (
//                 <option key={feature.id} value={feature.id}>
//                   {feature.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           {/* Input field for cover image */}
//           <div className="image-input mt-4">
//             {roomData.cover_image && roomData.cover_image instanceof Blob ? (
//               <div className="image-preview-container">
//                 <img
//                   src={URL.createObjectURL(roomData.cover_image)}
//                   alt="Selected Image"
//                   className="image-preview"
//                 />
//                 <div
//                   className="remove-image text-red-500 cursor-pointer"
//                   onClick={handleRemoveImage}
//                 >
//                   <FaTrash />
//                 </div>
//               </div>
//             ) : (
//               <div
//                 style={{
//                   color: "#fff",
//                   padding: "8px 12px",
//                   borderRadius: "5px",
//                   cursor: "pointer",
//                   display: "inline-flex",
//                   alignItems: "center",
//                 }}
//                 onClick={() => document.getElementById("roomImage").click()}
//               >
//                 <FcAddImage
//                   style={{ marginRight: "5px", height: "100px", width: "100px" }}
//                 />
//                 <input
//                   type="file"
//                   id="roomImage"
//                   accept="image/*"
//                   onChange={handleImageChange}
//                   style={{ display: "none" }}
//                 />
//               </div>
//             )}
//           </div>
//           <div className="buttonDiv mt-4">
//         <button
//           type="submit"
//           className="add-button bg-blue-500 text-white px-4 py-2 rounded cursor-pointer mx-auto"
//         >
//           Update
//         </button>
//         </div>
//       </form>
//       </div>
//     </Modal>
//   );
// }

