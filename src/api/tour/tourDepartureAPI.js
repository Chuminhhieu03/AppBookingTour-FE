import axiosInstance from '../axiosInstance';

const tourDepartureAPI = {
    // Get list tour departures by tour ID
    getByTourId: async (tourId) => {
        const response = await axiosInstance.get(`/tour-departures/get-list/${tourId}`);
        return response.data;
    },

    // Get by ID
    getById: async (id) => {
        const response = await axiosInstance.get(`/tour-departures/${id}`);
        return response.data;
    },

    // Create tour departure
    create: async (data) => {
        const response = await axiosInstance.post('/tour-departures', data);
        return response.data;
    },

    // Update tour departure
    update: async (id, data) => {
        const response = await axiosInstance.put(`/tour-departures/${id}`, data);
        return response.data;
    },

    // Delete tour departure
    delete: async (id) => {
        const response = await axiosInstance.delete(`/tour-departures/${id}`);
        return response.data;
    }
};

export { tourDepartureAPI };
export default tourDepartureAPI;
