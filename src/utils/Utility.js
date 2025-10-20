import dayjs from 'dayjs';

export default class Utility {
    static formatDate(dateString) {
        const date = new Date(dateString);
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
        return dayjs(dateString);
    }
}
