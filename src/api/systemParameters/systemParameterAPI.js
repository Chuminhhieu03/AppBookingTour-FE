import axiosInstance from '../axiosInstance';

const systemParameterAPI = {
    getByFeatureCode: async (featureCode) => {
        const response = await axiosInstance.post(`/SystemParameters/get-by-feature-code`, { featureCode });
        return response.data;
    }
};

export { systemParameterAPI };
export default systemParameterAPI;
