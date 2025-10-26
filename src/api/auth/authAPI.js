import axiosInstance from '../axiosInstance';

const authAPI = {
  // Login
  login: async (email, password) => {
    const response = await axiosInstance.post('/auth/login', { email, password });
    return response.data;
  },

  // Register
  register: async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  },

  // Refresh Token
  refreshToken: async () => {
    const response = await axiosInstance.post('/auth/refresh-token');
    return response.data;
  },

  // Forgot Password
  forgotPassword: async (email) => {
    const response = await axiosInstance.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset Password
  resetPassword: async (email, token, newPassword, confirmPassword) => {
    const response = await axiosInstance.post('/auth/reset-password', {
      email,
      token,
      newPassword,
      confirmPassword
    });
    return response.data;
  },

  // Confirm Email
  confirmEmail: async (userName, token) => {
    const response = await axiosInstance.get(`/auth/confirm-email?userName=${userName}&token=${encodeURIComponent(token)}`);
    return response.data;
  },

  // Change Password
  changePassword: async (email, currentPassword, newPassword, confirmPassword) => {
    const response = await axiosInstance.post('/auth/change-password', {
      email,
      currentPassword,
      newPassword,
      confirmPassword
    });
    return response.data;
  }
};

export default authAPI;
