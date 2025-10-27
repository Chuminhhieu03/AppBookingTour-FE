import axiosInstance from '../axiosInstance';

const cityAPI = {
    // Get All Cities
    getAllCities: async () => {
        const response = await axiosInstance.get('/cities/get-list');
        return response.data;
    }
};

export default cityAPI;
