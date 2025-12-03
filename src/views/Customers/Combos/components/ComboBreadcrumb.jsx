import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';

const ComboBreadcrumb = ({ combo }) => {
    const items = [
        {
            title: (
                <Link to="/">
                    <HomeOutlined /> Du lịch
                </Link>
            )
        },
        {
            title: <Link to="/combos">Combos</Link>
        }
    ];

    // Add fromCity if exists
    if (combo?.fromCityName) {
        items.push({
            title: combo.fromCityName
        });
    }

    // Add toCity if exists
    if (combo?.toCityName) {
        items.push({
            title: combo.toCityName
        });
    }

    // Add current combo name
    items.push({
        title: combo?.name || 'Chi tiết combo'
    });

    return (
        <Breadcrumb
            items={items}
            style={{
                marginBottom: 16,
                fontSize: 14
            }}
        />
    );
};

export default ComboBreadcrumb;
