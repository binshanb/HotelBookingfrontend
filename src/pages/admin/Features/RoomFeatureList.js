import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { AiOutlineAppstoreAdd,AiOutlineCheckCircle } from "react-icons/ai";
import { BiSolidEdit } from "react-icons/bi";
import { FaBan, FaCheck } from "react-icons/fa";
import {GoCheckCircleFill} from "react-icons/go";
import {HiExclamationCircle} from "react-icons/hi"
import { adminInstance } from "../../../utils/Axios";
import "../../admin/UserManagement.css";
import AddFeatureModal from '../Modal/AddFeatureModal'
import EditFeatureModal from '../Modal/EditFeatureModal' // Import the new modal
import { toast } from "react-toastify";


const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Feature Name", width: 130 },

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

const RoomFeatureList = () => {
  const [features, setFeatures] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);

  const fetchFeatures = async () => {
    try {
      const response = await adminInstance.get("booking/admin/room-feature/");
      setFeatures(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const handleAddFeature = async (featureData) => {
    try {
      await adminInstance.post("booking/admin/add-feature/", featureData);
      fetchFeatures();
      showToast("Feature added", "success");
      setIsAddModalOpen(false);
    } catch (error) {
      showToast("Error adding feature", "error");
      console.error("Error adding feature", error);
    }
  };

  const handleEditFeature = (feature) => {
    setSelectedFeature(feature);
    setIsEditModalOpen(true);
  };
 

  const handleUpdateFeature = async (updatedFeatureData, featureId) => {
    try {
      // Perform the update
      await adminInstance.put(`booking/admin/edit-feature/${featureId}/`, updatedFeatureData);
      
      // Refresh the features list after successful update
      fetchFeatures();
      
      // Show success message and close the modal
      showToast("Feature updated", "success");
      setIsEditModalOpen(false);
    } catch (error) {
      // Specific error handling based on error types
      if (error.response) {
        // Server responded with an error status code (e.g., 4xx, 5xx)
        showToast(`Error: ${error.response.data}`, "error");
      } else if (error.request) {
        // The request was made but no response was received
        showToast("No response received from server", "error");
      } else {
        // Something happened in setting up the request
        showToast("Error updating feature", "error");
      }
      console.error("Error updating feature", error);
    }
  };
  

  const handleBlockUnblockFeature = async (featureId, isBlocked) => {
    try {
      const endpoint = `booking/admin/room-feature/block-unblock/${featureId}/`;
      const updatedStatus = !isBlocked ? 'Unblocked' : 'Blocked';
      // let updatedStatus = '';
      
      // if (!isBlocked) {
      //   updatedStatus = 'Unblocked';
      // } else {
      //   updatedStatus = 'Blocked';
      // }
  
      await adminInstance.patch(endpoint, {
        is_active: !isBlocked,
      });
  
      fetchFeatures();
  
      if (!isBlocked) {
        showToast(`Feature ${updatedStatus}`, 'success');
      } else {
        showToast(`Feature ${updatedStatus}`, 'error');
      }
    } catch (error) {
      showToast('Error updating feature', 'error');
      console.error('Error updating feature', error);
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
            onClick={() => handleBlockUnblockFeature(params.row.id, params.row.is_active)}
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
            onClick={() => handleEditFeature(params.row)}
            style={{ border: "none", background: "none", cursor: "pointer" }}
          >
            <BiSolidEdit style={{ fontSize: "24px", color: "blue" }} />
          </button>{" "}
        </div>
      ),
    },
  ];

  return (
    <div style={{ backgroundColor: "#f0f0f0", height: "100vh" }}>
      <div className="data-grid-container">
        <div className="header d-flex justify-content-between align-items-center mb-4">
          <div style={{ fontWeight: "bold" }}>Room Features</div>
          <div
            className="d-flex align-items-center"
            onClick={() => setIsAddModalOpen(true)}
          >
            <AiOutlineAppstoreAdd style={{ fontSize: "30px" }} /> Add
          </div>
        </div>
        <div className="h-500 w-full overflow-hidden border border-gray-300">
          <DataGrid
            rows={features}
            columns={columnsWithActions}
            pageSize={5}
            checkboxSelection
            sx={{ backgroundColor: "white" }}
            isCellEditable={(params) => params.field !== "id"}
            onCellEditCommit={(params) => {
              const updatedData = [...features];
              updatedData[params.id - 1][params.field] = params.props.value;
              handleUpdateFeature(updatedData[params.id - 1]);
            }}
          />
        </div>

        <AddFeatureModal
          isOpen={isAddModalOpen}
          onRequestClose={() => setIsAddModalOpen(false)}
          onAddFeature={handleAddFeature}
        />

        <EditFeatureModal
          isOpen={isEditModalOpen}
          onRequestClose={() => setIsEditModalOpen(false)}
          onUpdateFeature={(updatedData) =>
            handleUpdateFeature(updatedData, selectedFeature.id)
          }
          featureData={selectedFeature}
        />
      </div>
    </div>
  );
};

export default RoomFeatureList;
