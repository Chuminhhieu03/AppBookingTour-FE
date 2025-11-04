import axiosInstance from '../axiosInstance';

const tourAPI = {
    // Search tours with advanced filters
    search: async (searchData) => {
        const response = await axiosInstance.post('/tours/search', searchData);
        return response.data;
    },

    // Get by ID
    getById: async (id) => {
        const response = await axiosInstance.get(`/tours/${id}`);
        return response.data;
    },

    // Create tour
    create: async (data) => {
        const response = await axiosInstance.post('/tours', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // Update tour
    update: async (id, data) => {
        const response = await axiosInstance.put(`/tours/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // Delete tour
    delete: async (id) => {
        const response = await axiosInstance.delete(`/tours/${id}`);
        return response.data;
    }
};

export { tourAPI };
export default tourAPI;
