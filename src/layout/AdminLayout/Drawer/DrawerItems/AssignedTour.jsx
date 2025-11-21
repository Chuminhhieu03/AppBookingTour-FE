const assignedTour = {
    id: 'assigned-tour',
    title: 'Tour được phân công',
    type: 'group',
    children: [
        {
            id: 'assigned-tour-list',
            title: 'Danh sách tour được phân công',
            type: 'item',
            icon: <i className="ph ph-clipboard-text" />,
            url: '/admin/assigned-tour/list'
        }
    ]
};

export default assignedTour;
