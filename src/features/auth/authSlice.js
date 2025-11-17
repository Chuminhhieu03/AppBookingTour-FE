import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authAPI from '../../api/auth/authAPI';
import { message } from 'antd';

// Initial state
const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null
};

// Async thunks
export const loginAsync = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
    try {
        const response = await authAPI.login(email, password);
        if (response.success) {
            // Save token to localStorage
            localStorage.setItem('accessToken', response.data.token);
            message.success(response.data.message || 'Đăng nhập thành công!');
            return response.data;
        }

        const errorMessage = response.message || response.data?.message || 'Đăng nhập thất bại';
        message.error(errorMessage);
        return rejectWithValue(errorMessage);
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi đăng nhập';
        message.error(errorMessage);
        return rejectWithValue(errorMessage);
    }
});

export const registerAsync = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try {
        const response = await authAPI.register(userData);
        if (response.success) {
            message.success(response.data.message || 'Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.');
            return response.data;
        }
        return rejectWithValue(response.message || 'Đăng ký thất bại');
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi đăng ký';
        message.error(errorMessage);
        return rejectWithValue(errorMessage);
    }
});

export const logoutAsync = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        const response = await authAPI.logout();
        localStorage.removeItem('accessToken');
        message.success('Đăng xuất thành công!');
        return response.data;
    } catch (error) {
        // Even if API fails, still logout locally
        localStorage.removeItem('accessToken');
        return {};
    }
});

export const forgotPasswordAsync = createAsyncThunk('auth/forgotPassword', async (email, { rejectWithValue }) => {
    try {
        const response = await authAPI.forgotPassword(email);
        if (response.success) {
            message.success(response.message || 'Đã gửi email hướng dẫn đặt lại mật khẩu');
            return response.data;
        }
        return rejectWithValue(response.message);
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra';
        message.error(errorMessage);
        return rejectWithValue(errorMessage);
    }
});

export const resetPasswordAsync = createAsyncThunk(
    'auth/resetPassword',
    async ({ email, token, newPassword, confirmPassword }, { rejectWithValue }) => {
        try {
            const response = await authAPI.resetPassword(email, token, newPassword, confirmPassword);
            if (response.success) {
                message.success(response.message || 'Đặt lại mật khẩu thành công!');
                return response.data;
            }
            return rejectWithValue(response.message);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra';
            message.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);

export const confirmEmailAsync = createAsyncThunk('auth/confirmEmail', async ({ userName, token }, { rejectWithValue }) => {
    try {
        const response = await authAPI.confirmEmail(userName, token);
        if (response.success) {
            message.success(response.data.message || 'Xác minh email thành công!');
            return response.data;
        }
        return rejectWithValue(response.message);
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra';
        message.error(errorMessage);
        return rejectWithValue(errorMessage);
    }
});

export const changePasswordAsync = createAsyncThunk(
    'auth/changePassword',
    async ({ email, currentPassword, newPassword, confirmPassword }, { rejectWithValue }) => {
        try {
            const response = await authAPI.changePassword(email, currentPassword, newPassword, confirmPassword);
            if (response.success) {
                message.success(response.data.message || 'Đổi mật khẩu thành công!');
                return response.data;
            }
            return rejectWithValue(response.message);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra';
            message.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);

// Auth slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('accessToken');
        }
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(loginAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.user = { userId: action.payload.userId, role: action.payload.role, fullName: action.payload.fullName };
            })
            .addCase(loginAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            });

        // Register
        builder
            .addCase(registerAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerAsync.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(registerAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Logout
        builder
            .addCase(logoutAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutAsync.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            })
            .addCase(logoutAsync.rejected, (state) => {
                state.loading = false;
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            });

        // Forgot Password
        builder
            .addCase(forgotPasswordAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgotPasswordAsync.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(forgotPasswordAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Reset Password
        builder
            .addCase(resetPasswordAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPasswordAsync.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(resetPasswordAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Confirm Email
        builder
            .addCase(confirmEmailAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(confirmEmailAsync.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(confirmEmailAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Change Password
        builder
            .addCase(changePasswordAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changePasswordAsync.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(changePasswordAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
