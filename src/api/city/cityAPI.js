import axiosInstance from '../axiosInstance';

const cityAPI = {
    // Get List City
    getListCity: async () => {
        const response = await axiosInstance.get('/cities/get-list');
        return response.data;
    },

    // Get City by ID
    getById: async (id) => {
        const response = await axiosInstance.get(`/cities/${id}`);
        return response.data;
    }
};

export default cityAPI;
