const statistics = {
    id: 'statistics',
    title: 'Thống kê',
    type: 'group',
    children: [
        {
            id: 'statistics-overview',
            title: 'Thống kê tổng quan',
            type: 'item',
            icon: <i className="ph ph-chart-bar" />,
            url: '/admin/statistics/overview'
        },
        {
            id: 'item-statistics-by-revenue',
            title: 'Thống kê sản phẩm theo doanh thu',
            type: 'item',
            icon: <i className="ph ph-currency-dollar" />,
            url: '/admin/statistics/item-revenue'
        },
        {
            id: 'item-statistics-by-booking-count',
            title: 'Thống kê sản phẩm theo lượt booking',
            type: 'item',
            icon: <i className="ph ph-calendar-check" />,
            url: '/admin/statistics/item-booking-count'
        }
    ]
};

export default statistics;
