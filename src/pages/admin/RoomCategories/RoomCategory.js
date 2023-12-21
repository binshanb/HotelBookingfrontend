import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { AiOutlineAppstoreAdd,AiOutlineCheckCircle } from "react-icons/ai";
import { BiSolidEdit } from "react-icons/bi";
import { FaBan, FaCheck } from "react-icons/fa";
import {GoCheckCircleFill} from "react-icons/go";
import {HiExclamationCircle} from "react-icons/hi"
import { adminInstance } from "../../../utils/Axios";
import "../../admin/UserManagement.css"
import AddCategoryModal from "../Modal/AddCategoryModal"
import EditCategoryModal from "../Modal/EditCategoryModal"; // Import the new modal
import { toast } from "react-toastify";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "category_name", headerName: "Category_name", width: 130 },
  {
    field: "image",
    headerName: "Image",
    width: 200,
    renderCell: (params) => (
      <img
        src={`${params.value}`}
        alt="Category"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    ),
  },
  {
    field: "is_active",
    headerName: "Active",
    width: 100,
    renderCell: (params) => (
      params.value ? (
        <GoCheckCircleFill color="green" style={{fontSize: "24px"}} />
      ) : (
        <HiExclamationCircle color="red" style={{fontSize: "24px"}}/>
      )
    ),
  },];

const showToast = (message, type = "error") => {
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

const RoomCategory = () => {
  const [categories, setCategories] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await adminInstance.get("booking/admin/room-category/");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (categoryData) => {
    try {
      await adminInstance.post("booking/admin/add-category/", categoryData);
      fetchCategories();
      showToast("Category added", "success");
      setIsAddModalOpen(false);
    } catch (error) {
      showToast("Error adding category", "error");
      console.error("Error adding category", error);
    }
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };
 

  const handleUpdateCategory = async (updatedCategoryData, categoryId) => {
    try {
      console.log(updatedCategoryData,'pppppppppppppppppppppppp');
      await adminInstance.put(`booking/admin/edit-category/${categoryId}/`, updatedCategoryData);
      fetchCategories();
      showToast("Category updated", "success");
      setIsEditModalOpen(false);
    } catch (error) {
      showToast("Error updating category", "error");
      console.error("Error updating category", error);
    }
  };

  const handleBlockUnblockCategory = async (categoryId, isBlocked) => {
    try {
      await adminInstance.patch(`booking/admin/room-category/block-unblock/${categoryId}/`, {
        is_active: !isBlocked,
      });
      fetchCategories();
      showToast(`Category ${isBlocked ? 'Unblocked' : 'Blocked'}`, "success");
    } catch (error) {
      showToast("Error updating category", "error");
      console.error("Error updating category", error);
    }
  };

  const columnsWithActions = [
    ...columns,
    {
      field: "blockUnblock",
      headerName: "Block/Unblock",
      width: 150,
      renderCell: (params) => (
        <div>
          <button
            onClick={() => handleBlockUnblockCategory(params.row.id, params.row.is_active)}
            style={{ border: "none", background: "none", cursor: "pointer" }}
          >
        {params.row.is_active ? <FaBan color="red" style={{ fontSize: "24px"}}/> : <AiOutlineCheckCircle color="green" style={{ fontSize: "24px"}} />}
          </button>{" "}
        </div>
      ),
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 130,
      renderCell: (params) => (
        <div>
          <button
            onClick={() => handleEditCategory(params.row)}
            style={{ border: "none", background: "none", cursor: "pointer" }}
          >
            <BiSolidEdit style={{ fontSize: "24px", color: "blue" }} />
          </button>{" "}
        </div>
      ),
    },
  ];

  return (
    <div style={{ backgroundColor: "pink", height: "100vh" }}>
      <div className="data-grid-container">
        <div className="header d-flex justify-content-between align-items-center mb-4">
          <div style={{ fontWeight: "bold" }}>Category Management</div>
          <div
            className="d-flex align-items-center"
            onClick={() => setIsAddModalOpen(true)}
          >
            <AiOutlineAppstoreAdd style={{ fontSize: "30px" }} /> Add
          </div>
        </div>
        <div className="h-500 w-full overflow-hidden border border-gray-300">
          <DataGrid
            rows={categories}
            columns={columnsWithActions}
            pageSize={5}
            checkboxSelection
            sx={{ backgroundColor: "white" }}
            isCellEditable={(params) => params.field !== "id"}
            onCellEditCommit={(params) => {
              const updatedData = [...categories];
              updatedData[params.id - 1][params.field] = params.props.value;
              handleUpdateCategory(updatedData[params.id - 1]);
            }}
          />
        </div>

        <AddCategoryModal
          isOpen={isAddModalOpen}
          onRequestClose={() => setIsAddModalOpen(false)}
          onAddCategory={handleAddCategory}
        />

        <EditCategoryModal
          isOpen={isEditModalOpen}
          onRequestClose={() => setIsEditModalOpen(false)}
          onUpdateCategory={(updatedData) =>
            handleUpdateCategory(updatedData, selectedCategory.id)
          }
          categoryData={selectedCategory}
        />
      </div>
    </div>
  );
};

export default RoomCategory;
















































// import React, { useState, useEffect } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import { AiOutlineAppstoreAdd,AiOutlineCheckCircle } from "react-icons/ai";
// import { BiSolidEdit } from "react-icons/bi";
// import { FaBan, FaCheck } from "react-icons/fa";
// import {GoCheckCircleFill} from "react-icons/go";
// import {HiExclamationCircle} from "react-icons/hi"
// import { adminInstance } from "../../../utils/Axios";
// import "../../admin/UserManagement.css";
// import AddCategoryModal from "../../admin/Modal/AddCategoryModal";
// import EditCategoryModal from "../../admin/Modal/EditCategoryModal"; // Import the new modal
// import { toast } from "react-toastify";


// const columns = [
//   { field: "id", headerName: "ID", width: 70 },
//   { field: "category_name", headerName: "Category_name", width: 130 },
//   {
//     field: "image",
//     headerName: "Image",
//     width: 200,
//     renderCell: (params) => (
//       <img
//         src={`${params.value}`}
//         alt="Category"
//         style={{ width: "100%", height: "100%", objectFit: "cover" }}
//       />
//     ),
//   },
//   {
//     field: "is_active",
//     headerName: "Active",
//     width: 100,
//     renderCell: (params) => (
//       params.value ? (
//         <GoCheckCircleFill color="green" style={{fontSize: "24px"}} />
//       ) : (
//         <HiExclamationCircle color="red" style={{fontSize: "24px"}}/>
//       )
//     ),
//   },];

// const showToast = (message, type = "error") => {
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

// const RoomCategory = () => {
//   const [categories, setCategories] = useState([]);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState(null);

//   const fetchCategories = async () => {
//     try {
//       const response = await adminInstance.get("booking/admin/room-category/");
//       setCategories(response.data);
//     } catch (error) {
//       console.error("Error fetching categories", error);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const handleAddCategory = async (categoryData) => {
//     try {
//       await adminInstance.post("booking/admin/add-category/", categoryData);
//       fetchCategories();
//       showToast("Category added", "success");
//       setIsAddModalOpen(false);
//     } catch (error) {
//       showToast("Error adding category", "error");
//       console.error("Error adding category", error);
//     }
//   };

//   const handleEditCategory = (category) => {
//     setSelectedCategory(category);
//     setIsEditModalOpen(true);
//   };
 

//   const handleUpdateCategory = async (updatedCategoryData, categoryId) => {
//     console.log(updatedCategoryData,'updated dataaaaaaaaaaaaaaaaaaaa',categoryId,'iddddddddd')
//     try {
//       console.log(updatedCategoryData,'pppppppppppppppppppppppp');
//       await adminInstance.put(`booking/admin/room-category/${categoryId}/`, updatedCategoryData);
//       fetchCategories();
//       showToast("Category updated", "success");
//       setIsEditModalOpen(false);
//     } catch (error) {
//       showToast("Error updating category", "error");
//       console.error("Error updating category", error);
//     }
//   };

//   const handleBlockUnblockCategory = async (categoryId, isBlocked) => {
//     try {
//       await adminInstance.patch(`booking/admin/room-category/block-unblock/${categoryId}/`, {
//         is_active: !isBlocked,
//       });
//       fetchCategories();
//       showToast(`Category ${isBlocked ? 'Unblocked' : 'Blocked'}`, "success");
//     } catch (error) {
//       showToast("Error updating category", "error");
//       console.error("Error updating category", error);
//     }
//   };

//   const columnsWithActions = [
//     ...columns,
//     {
//       field: "blockUnblock",
//       headerName: "Block/Unblock",
//       width: 150,
//       renderCell: (params) => (
//         <div>
//           <button
//             onClick={() => handleBlockUnblockCategory(params.row.id, params.row.is_active)}
//             style={{ border: "none", background: "none", cursor: "pointer" }}
//           >
//         {params.row.is_active ? <FaBan color="red" style={{ fontSize: "24px"}}/> : <AiOutlineCheckCircle color="green" style={{ fontSize: "24px"}} />}
//           </button>{" "}
//         </div>
//       ),
//     },
//     {
//       field: "edit",
//       headerName: "Edit",
//       width: 130,
//       renderCell: (params) => (
//         <div>
//           <button
//             onClick={() => handleEditCategory(params.row)}
//             style={{ border: "none", background: "none", cursor: "pointer" }}
//           >
//             <BiSolidEdit style={{ fontSize: "24px", color: "blue" }} />
//           </button>{" "}
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div style={{ backgroundColor: "pink", height: "100vh" }}>
//       <div className="data-grid-container">
//         <div className="header d-flex justify-content-between align-items-center mb-4">
//           <div style={{ fontWeight: "bold" }}>Category Management</div>
//           <div
//             className="d-flex align-items-center"
//             onClick={() => setIsAddModalOpen(true)}
//           >
//             <AiOutlineAppstoreAdd style={{ fontSize: "30px" }} /> Add
//           </div>
//         </div>
//         <div className="h-500 w-full overflow-hidden border border-gray-300">
//           {/* <DataGrid
//             rows={categories}
//             columns={columnsWithActions}
//             pageSize={5}
//             checkboxSelection
//             sx={{ backgroundColor: "white" }}
//             isCellEditable={(params) => params.field !== "id"}
//             onCellEditCommit={(params) => {
//               const updatedData = [...categories];
//               updatedData[params.id - 1][params.field] = params.props.value;
//               handleUpdateCategory(updatedData[params.id - 1]);
//             }}
//           /> */}
//         </div>

//         <AddCategoryModal
//           isOpen={isAddModalOpen}
//           onRequestClose={() => setIsAddModalOpen(false)}
//           onAddCategory={handleAddCategory}
//         />

//         <EditCategoryModal
//           isOpen={isEditModalOpen}
//           onRequestClose={() => setIsEditModalOpen(false)}
//           onUpdateCategory={(updatedData) =>
//             handleUpdateCategory(updatedData, selectedCategory.id)
//           }
//           categoryData={selectedCategory}
//         />
//       </div>
//     </div>
//   );
// };

// export default RoomCategory;