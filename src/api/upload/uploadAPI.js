import axiosInstance from '../axiosInstance';

const uploadAPI = {
    // Upload single image
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axiosInstance.post('/upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // Upload multiple images
    uploadImages: async (files) => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });

        const response = await axiosInstance.post('/upload/images', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
};

export { uploadAPI };
export default uploadAPI;
