import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {updateRooms} from '../../../redux/slices/roomslices/roomFilterSlice';


export const getUniqueValues = (rooms, type) => {
    return [...new Set(rooms.map((room) => room[type]))];
  };
export default function RoomFilter() {
  const dispatch = useDispatch();
  const roomsData = useSelector((state) => state.rooms);

  if (!roomsData || !roomsData.rooms || !roomsData.rooms.length) {
    return null; // or a loading indicator or default UI
  }
  const {
    rooms,
    category_name,
    capacity,
    price_per_night,
    maxPrice,
    minPrice,
    reserved,
    // ... other state properties from Redux store
  } = roomsData;

  // const handleChange = (e) => {
  //   // Handle change and dispatch action to update Redux store
  //   dispatch(
  //     updateRooms({
  //       rooms:rooms,
  //       category_name: category_name,
  //       capacity:capacity, 
  //       price_per_night:price_per_night, 
  //       maxPrice:maxPrice,
  //       minPrice: minPrice,
  //       reserved: reserved,
  //       // ... dispatch other updated state properties
  //     })
  //   );
  // };
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (roomsData && roomsData.rooms) {
      let filteredRooms = roomsData.rooms;
  
    if (name === 'category_name' && value !== 'all') {
      filteredRooms = filteredRooms.filter((room) => room.category_name === value);
    }
  
    if (name === 'price_per_night') {
      filteredRooms = filteredRooms.filter(
        (room) => room.price_per_night <= parseInt(value)
      );
    }
  
    dispatch(
      updateRooms({
        rooms: filteredRooms,
        // Include other updated state properties here if needed
      })
    );
  };
}
  
  let roomTypes = ["all", ...getUniqueValues(rooms, "category_name")];
  const selectTypes = roomTypes.map((cat, index) => (
    <option key={index} value={cat}>
      {cat}
    </option>
  ));

  let capacityValues = [...getUniqueValues(rooms, "capacity")];
  const selectCapacity = capacityValues.sort().map((cap, index) => (
    <option key={index} value={cap}>
      {cap}
    </option>
  ));

  return (
    <>
      <form className="rooms-filter">
        <div className="form-group">
          <label htmlFor="inputCategory">Category</label>
          <select
            id="inputCategory"
            className="form-control"
            name="category_name"
            value={category_name}
            onChange={handleChange}
          >
            {selectTypes}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="inputCapacity">Capacity</label>
          <select
            id="inputCapacity"
            className="form-control"
            name="capacity"
            value={capacity}
            onChange={handleChange}
          >
            {selectCapacity}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="customRange3">
            Room Cost Max ${price_per_night}
          </label>
          <input
            name="price_per_night"
            value={price_per_night}
            type="range"
            className="custom-range pt-2"
            min={minPrice}
            max={maxPrice}
            step="1.0"
            id="customRange3"
            onChange={handleChange}
          />
        </div>

        {/* ... other form elements */}
      </form>
    </>
  );
}
