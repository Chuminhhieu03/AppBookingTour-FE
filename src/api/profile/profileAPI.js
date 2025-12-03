import axiosInstance from 'api/axiosInstance';

const profileAPI = {
    // GET profile
    getProfile: async (id) => {
        const response = await axiosInstance.get(`/profiles/${id}`);
        return response.data;
    },

    // GET list guides
    getGuides: async () => {
        const response = await axiosInstance.get('/profiles/get-list-guide');
        return response.data;
    },

    // PUT update profile
    updateProfile: async (id, data) => {
        const response = await axiosInstance.put(`/profiles/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
};

export default profileAPI;
