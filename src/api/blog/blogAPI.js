import axiosInstance from '../axiosInstance';

const blogAPI = {
    // Get list with filters & pagination
    getList: async (params) => {
        const response = await axiosInstance.get('/blogposts', { params });
        return response.data;
    },

    // Get by ID
    getById: async (id) => {
        const response = await axiosInstance.get(`/blogposts/${id}`);
        return response.data;
    },

    // Get by slug (public)
    getBySlug: async (slug) => {
        const response = await axiosInstance.get(`/blogposts/slug/${slug}`);
        return response.data;
    },

    // Create blog post
    create: async (data) => {
        const response = await axiosInstance.post('/blogposts', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // Update blog post
    update: async (id, data) => {
        const response = await axiosInstance.put(`/blogposts/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // Delete blog post
    delete: async (id) => {
        const response = await axiosInstance.delete(`/blogposts/${id}`);
        return response.data;
    }
};

export { blogAPI };
export default blogAPI;
