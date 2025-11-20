import axiosInstance from '../axiosInstance';

const discountAPI = {
    // Get list with filters & pagination
    getList: async (params) => {
        const response = await axiosInstance.get('/Discount', { params });
        return response.data;
    },

    search: async (data) => {
        const response = await axiosInstance.post('/Discount/search', data);
        return response.data;
    },

    // Get discount by ID
    getById: async (id) => {
        const response = await axiosInstance.get(`/Discount/${id}`);
        return response.data;
    },

    // Create a new discount
    create: async (data) => {
        const response = await axiosInstance.post('/Discount', data);
        return response.data;
    },

    // Update an existing discount
    update: async (id, data) => {
        const response = await axiosInstance.put(`/Discount/${id}`, data);
        return response.data;
    },

    // Delete a discount
    delete: async (id) => {
        const response = await axiosInstance.delete(`/Discount/${id}`);
        return response.data;
    },

    getByEntityType: async (data) => {
        const response = await axiosInstance.post(`/Discount/get-by-entity-type`, data);
        return response.data;
    }
};

export { discountAPI };
export default discountAPI;
