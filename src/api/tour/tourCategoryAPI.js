import axiosInstance from '../axiosInstance';

const tourCategoryAPI = {
    // Search tour categories with pagination
    search: async (searchData) => {
        const response = await axiosInstance.post('/tour-categories/search', searchData);
        return response.data;
    },

    // Get list tour categories
    getList: async () => {
        const response = await axiosInstance.get('/tour-categories/get-list');
        return response.data;
    },

    // Get tour category by ID
    getById: async (id) => {
        const response = await axiosInstance.get(`/tour-categories/${id}`);
        return response.data;
    },

    // Create tour category
    create: async (data) => {
        const response = await axiosInstance.post('/tour-categories', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // Update tour category
    update: async (id, data) => {
        const response = await axiosInstance.put(`/tour-categories/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // Delete tour category
    delete: async (id) => {
        const response = await axiosInstance.delete(`/tour-categories/${id}`);
        return response.data;
    }
};

export { tourCategoryAPI };
export default tourCategoryAPI;
