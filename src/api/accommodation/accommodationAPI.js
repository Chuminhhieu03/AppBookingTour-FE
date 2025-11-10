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

    getById: async (id) => {
        const response = await axiosInstance.get(`/Accommodation/${id}`);
        return response.data;
    },

    update: async (id, formData) => {
        const response = await axiosInstance.put(`/Accommodation/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
};

export { accommodationAPI };
export default accommodationAPI;
