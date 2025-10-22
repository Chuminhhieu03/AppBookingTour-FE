const service = {
    id: 'service',
    title: 'Dịch vụ',
    type: 'group',
    children: [
        {
            id: 'accommodation',
            title: 'Cơ sở lưu trú',
            type: 'item',
            icon: <i className="ph ph-house" />,
            url: '/admin/service/accommodation'
        }
    ]
};

export default service;