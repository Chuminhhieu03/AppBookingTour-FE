import dayjs from 'dayjs';

export default class Utility {
    static formatDate(dateString) {
        const date = new Date(dateString + 'Z');
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        const hh = String(date.getHours()).padStart(2, '0');
        const mi = String(date.getMinutes()).padStart(2, '0');
        const ss = String(date.getSeconds()).padStart(2, '0');
        const formatted = `${dd}/${mm}/${yyyy} ${hh}:${mi}:${ss}`;
        return formatted;
    }

    static convertStringToDate(dateString) {
        return dayjs(dateString + 'Z');
    }

    // Format price to Vietnamese currency
    static formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    }

    // Format duration days to "X ngày Y đêm"
    static formatDuration(days) {
        if (days <= 0) return '0 ngày';
        const nights = days - 1;
        return nights > 0 ? `${days} ngày ${nights} đêm` : `${days} ngày`;
    }

    static getLabelByValue(list, value) {
        const item = list.find((i) => i.value === value || i.key === value);
        return item ? item.label : '';
    }

    // Get tag color for status displays
    static getTagColor(type, value) {
        switch (type) {
            case 'tourDepartureStatus':
                switch (value) {
                    case 1: // Available
                    case 'Available':
                        return 'green';
                    case 2: // Full
                    case 'Full':
                        return 'red';
                    case 3: // Cancelled
                    case 'Cancelled':
                        return 'gray';
                    default:
                        return 'orange';
                }
            case 'status':
                switch (value) {
                    case true:
                    case 'Active':
                        return 'green';
                    case false:
                    case 'Inactive':
                        return 'red';
                    default:
                        return 'default';
                }
            default:
                return 'default';
        }
    }
}
