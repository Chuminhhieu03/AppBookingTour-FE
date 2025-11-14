import axiosInstance from '../axiosInstance';

const roomInventoryAPI = {
    create: async (data) => {
        const response = await axiosInstance.post('/RoomInventory', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await axiosInstance.put(`/RoomInventory/${id}`, data);
        return response.data;
    },

    getById: async (id) => {
        const response = await axiosInstance.get(`/RoomInventory/${id}`);
        return response.data;
    },

    delete: async (id) => {
        const response = await axiosInstance.delete(`/RoomInventory/${id}`);
        return response.data;
    }
};

export { roomInventoryAPI };
export default roomInventoryAPI;
