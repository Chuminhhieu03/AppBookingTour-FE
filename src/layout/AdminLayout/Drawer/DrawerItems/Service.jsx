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
        },
        {
            id: 'tour',
            title: 'Tour',
            type: 'collapse',
            icon: <i className="ph ph-airplane" />,
            children: [
                {
                    id: 'tour-list',
                    title: 'Tour',
                    type: 'item',
                    url: '/admin/service/tour'
                },
                {
                    id: 'tour-category-list',
                    title: 'Danh mục Tour',
                    type: 'item',
                    url: '/admin/service/tour-category'
                },
                {
                    id: 'tour-type-list',
                    title: 'Loại Tour',
                    type: 'item',
                    url: '/admin/service/tour-type'
                }
            ]
        }
    ]
};

export default service;
