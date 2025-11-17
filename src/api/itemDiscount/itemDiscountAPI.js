import axiosInstance from '../axiosInstance';

const itemDiscountAPI = {
    assignToItem: async (data) => {
        const response = await axiosInstance.post(`/item-discounts/assign-discount`, data);
        return response.data;
    }
};

export { itemDiscountAPI };
export default itemDiscountAPI;
