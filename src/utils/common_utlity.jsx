export function getVehicleLabel(vehicle) {
    if (vehicle === 1) return <>Xe ô tô</>;
    if (vehicle === 2) return <>Máy bay</>;
    return vehicle;
}

export function getStatusLabel(status) {
    if (status == 1) return <>Kích hoạt</>;
    if (status == 0) return <>Không kích hoạt</>;
    return status;
}

export function getStatusColor(status) {
    if (status == 1) return 'success';
    if (status == 0) return 'default';
    return 'default';
}

export default {
    getVehicleLabel,
    getStatusLabel,
    getStatusColor
};
