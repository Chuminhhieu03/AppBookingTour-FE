import axiosInstance from '../axiosInstance';

const comboAPI = {
    // GET list với filters & pagination
    getList: async (params) => {
        const response = await axiosInstance.get('/combos', { params });
        return response.data;
    },

    // GET by ID
    getById: async (id) => {
        const response = await axiosInstance.get(`/combos/${id}`);
        return response.data;
    },

    // POST create
    create: async (data) => {
        const response = await axiosInstance.post('/combos', data);
        return response.data;
    },

    // PUT update
    update: async (id, data) => {
        const response = await axiosInstance.put(`/combos/${id}`, data);
        return response.data;
    },

    // DELETE (soft delete)
    delete: async (id) => {
        const response = await axiosInstance.delete(`/combos/${id}`);
        return response.data;
    },

    // POST upload images
    uploadImages: async (id, formData) => {
        const response = await axiosInstance.post(`/combos/${id}/upload-images`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // DELETE cover image
    deleteCoverImage: async (id) => {
        const response = await axiosInstance.delete(`/combos/${id}/cover-image`);
        return response.data;
    },

    // DELETE gallery images
    deleteGalleryImages: async (id, imageUrls) => {
        const response = await axiosInstance.delete(`/combos/${id}/gallery-images`, {
            data: { imageUrls }
        });
        return response.data;
    }
};

// Export both named and default for flexibility
export { comboAPI };
export default comboAPI;
