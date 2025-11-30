import axiosInstance from '../axiosInstance';

const accommodationAPI = {
    create: async (formData) => {
        const response = await axiosInstance.post('/Accommodation', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    search: async (request) => {
        const response = await axiosInstance.post('/Accommodation/search', request);
        return response.data;
    },

    searchAccommodationsForCustomer: async (query) => {
        const response = await axiosInstance.post('/Accommodation/search-for-customer', query);
        return response.data;
    },

    getById: async (id) => {
        const response = await axiosInstance.get(`/Accommodation/${id}`);
        return response.data;
    },

    getByIdForCustomer: async (id) => {
        const response = await axiosInstance.get(`/Accommodation/customer/${id}`);
        return response.data;
    },

    update: async (id, formData) => {
        const response = await axiosInstance.put(`/Accommodation/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    delete: async (id) => {
        const response = await axiosInstance.delete(`/Accommodation/${id}`);
        return response.data;
    }
};

export { accommodationAPI };
export default accommodationAPI;
