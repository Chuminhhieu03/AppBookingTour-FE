import axiosInstance from '../axiosInstance';

const bookingAPI = {
    // POST - Tạo booking combo
    create: async (data) => {
        const response = await axiosInstance.post('/bookings', data);
        return response.data;
    },

    // POST - Áp dụng mã giảm giá
    applyDiscount: async (data) => {
        const response = await axiosInstance.post('/bookings/apply-discount', data);
        return response.data;
    },

    // GET - Lấy chi tiết booking
    getById: async (id) => {
        const response = await axiosInstance.get(`/bookings/${id}`);
        return response.data;
    },

    // POST - Khởi tạo thanh toán
    initPayment: async (data) => {
        const response = await axiosInstance.post('/bookings/payment', data);
        return response.data;
    },

    // GET - Kiểm tra trạng thái thanh toán
    getPaymentStatus: async (bookingId) => {
        const response = await axiosInstance.get(`/bookings/payment-status/${bookingId}`);
        return response.data;
    }
};

export { bookingAPI };
export default bookingAPI;
