import axiosInstance from '../axiosInstance';

const tourTypeAPI = {
    // Search tour types with advanced filters
    search: async (searchData) => {
        const response = await axiosInstance.post('/tour-types/search', searchData);
        return response.data;
    },

    // Get list tour types
    getList: async () => {
        const response = await axiosInstance.get('/tour-types/get-list');
        return response.data;
    },

    // Get tour type by ID
    getById: async (id) => {
        const response = await axiosInstance.get(`/tour-types/${id}`);
        return response.data;
    },

    // Create tour type
    create: async (data) => {
        const response = await axiosInstance.post('/tour-types', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // Update tour type
    update: async (id, data) => {
        const response = await axiosInstance.put(`/tour-types/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // Delete tour type
    delete: async (id) => {
        const response = await axiosInstance.delete(`/tour-types/${id}`);
        return response.data;
    }
};

export { tourTypeAPI };
export default tourTypeAPI;
