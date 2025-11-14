import axiosInstance from '../axiosInstance';

const statisticsAPI = {
    // GET overview statistics
    getOverviewStatistics: async () => {
        const response = await axiosInstance.get('/statistics/overview');
        return response.data;
    },

    // GET list item statistics by revenue
    getItemStatisticsByRevenue: async (params) => {
        const response = await axiosInstance.get('/statistics/item-revenue', { params });
        return response.data;
    },

    // GET item revenue details
    getItemRevenueDetails: async (params) => {
        const response = await axiosInstance.get('/statistics/item-revenue-detail', { params });
        return response.data;
    },

    // GET list item statistics by booking count
    getItemStatisticsByBookingCount: async (params) => {
        const response = await axiosInstance.get('/statistics/item-booking-count', { params });
        return response.data;
    },

    // GET item booking count details
    getItemBookingCountDetails: async (params) => {
        const response = await axiosInstance.get('/statistics/item-booking-count-detail', { params });
        return response.data;
    }
};

export default statisticsAPI;
