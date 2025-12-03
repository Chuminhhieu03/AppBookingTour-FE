import { get } from 'react-hook-form';
import axiosInstance from '../axiosInstance';

const roomTypeAPI = {
    create: async (formData) => {
        const response = await axiosInstance.post('/RoomType', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    update: async (id, formData) => {
        const response = await axiosInstance.put(`/RoomType/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    getById: async (id) => {
        const response = await axiosInstance.get(`/RoomType/${id}`);
        return response.data;
    },

    delete: async (id) => {
        const response = await axiosInstance.delete(`/RoomType/${id}`);
        return response.data;
    },

    getPreviewById: async (id) => {
        const response = await axiosInstance.get(`/RoomType/preview/${id}`);
        return response.data;
    }
};

export { roomTypeAPI };
export default roomTypeAPI;
