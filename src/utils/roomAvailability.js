import instance from "./Axios"

// Function to check room availability
export const checkRoomAvailability = async (checkInDate, checkOutDate) => {
    try {
        const response = await instance.get(`/api/room-availability-check/?check_in=${checkInDate}&check_out=${checkOutDate}`);
        return response.data;
    } catch (error) {
        console.error('Error checking room availability:', error);
        throw error;
    }
};

// Function to book a room
export const bookRoom = async (bookingData) => {
    try {
        const response = await instance.post('/api/booking/create-room-booking/', bookingData);
        return response.data;
    } catch (error) {
        console.error('Error creating room booking:', error);
        throw error;
    }
};
