import { AppstoreOutlined } from '@ant-design/icons';

const combo = {
    id: 'combo',
    title: 'Combo Tours',
    type: 'group',
    children: [
        {
            id: 'combo-tours',
            title: 'Combo Tours',
            type: 'item',
            icon: <i className="ph ph-article" />,
            url: '/admin/combos'
        }
    ]
};

export default combo;
