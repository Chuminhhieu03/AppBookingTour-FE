import axiosInstance from '../axiosInstance';

const tourItineraryAPI = {
    // Get list tour itineraries by tour ID
    getByTourId: async (tourId) => {
        const response = await axiosInstance.get(`/tour-itineraries/get-list/${tourId}`);
        return response.data;
    },

    // Get by ID
    getById: async (id) => {
        const response = await axiosInstance.get(`/tour-itineraries/${id}`);
        return response.data;
    },

    // Create tour itinerary
    create: async (data, tourId) => {
        const response = await axiosInstance.post(`/tour-itineraries/${tourId}`, data);
        return response.data;
    },

    // Update tour itinerary
    update: async (id, data) => {
        const response = await axiosInstance.put(`/tour-itineraries/${id}`, data);
        return response.data;
    },

    // Delete tour itinerary
    delete: async (id) => {
        const response = await axiosInstance.delete(`/tour-itineraries/${id}`);
        return response.data;
    }
};

export default tourItineraryAPI;
export { tourItineraryAPI };
