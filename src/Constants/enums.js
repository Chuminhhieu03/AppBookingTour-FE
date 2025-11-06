// Vehicle Types
export const VEHICLE_TYPES = {
    CAR: { value: 1, label: 'Xe ô tô', icon: '🚗' },
    PLANE: { value: 2, label: 'Máy bay', icon: '✈️' }
};

// Combo Schedule Status
export const COMBO_STATUS = {
    AVAILABLE: { value: 1, label: 'Còn chỗ', color: 'success' },
    FULL: { value: 2, label: 'Đã đầy', color: 'error' },
    CANCELLED: { value: 3, label: 'Đã hủy', color: 'default' }
};

// Active Status
export const ACTIVE_STATUS = {
    ACTIVE: { value: true, label: 'Hoạt động', color: 'success' },
    INACTIVE: { value: false, label: 'Không hoạt động', color: 'default' }
};
