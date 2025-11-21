import { Card, Collapse } from 'antd';
import { CaretRightOutlined, CoffeeOutlined } from '@ant-design/icons';

const ComboItinerary = ({ comboId, durationDays, description }) => {
    // Mock data - sẽ fetch từ API sau
    const mockItinerary = [
        {
            dayNumber: 1,
            title: 'TP. HCM - Sân bay - Hà Nội - Sapa',
            mealInfo: '02 bữa ăn (trưa, chiều)',
            description: `
                <p><strong>Sáng:</strong> Xe và hướng dẫn viên đón quý khách tại điểm hẹn, khởi hành đi sân bay Tân Sơn Nhất.</p>
                <p><strong>Trưa:</strong> Đến Hà Nội, dùng bữa trưa tại nhà hàng. Sau đó khởi hành đi Sapa.</p>
                <p><strong>Chiều:</strong> Đến Sapa, nhận phòng khách sạn. Tự do khám phá thị trấn Sapa về đêm.</p>
            `
        },
        {
            dayNumber: 2,
            title: 'Sapa - Fansipan Legend',
            mealInfo: '03 bữa ăn (sáng, trưa, chiều)',
            description: `
                <p><strong>Sáng:</strong> Dùng bữa sáng tại khách sạn. Khởi hành chinh phục đỉnh Fansipan bằng cáp treo.</p>
                <p><strong>Trưa:</strong> Dùng bữa trưa tại nhà hàng trên đỉnh Fansipan.</p>
                <p><strong>Chiều:</strong> Tham quan các điểm đến xung quanh Sapa: Thác Bạc, Cổng Trời, Làng Cát Cát.</p>
            `
        },
        {
            dayNumber: 3,
            title: 'Sapa - Hà Nội',
            mealInfo: '03 bữa ăn (sáng, trưa, chiều)',
            description: `
                <p><strong>Sáng:</strong> Dùng bữa sáng tại khách sạn. Tự do mua sắm đặc sản Sapa.</p>
                <p><strong>Trưa:</strong> Dùng bữa trưa. Khởi hành về Hà Nội.</p>
                <p><strong>Chiều:</strong> Tham quan Hồ Hoàn Kiếm, Phố cổ Hà Nội. Ra sân bay về TP.HCM. Kết thúc chương trình.</p>
            `
        }
    ];

    const items = mockItinerary.map((day) => ({
        key: day.dayNumber.toString(),
        label: (
            <div>
                <div style={{ fontSize: 16, fontWeight: 'bold', color: '#1E88E5' }}>
                    Ngày {day.dayNumber}: {day.title}
                </div>
                <div style={{ fontSize: 13, color: '#64748B', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CoffeeOutlined /> {day.mealInfo}
                </div>
            </div>
        ),
        children: (
            <div
                style={{
                    padding: 16,
                    background: '#F9FAFB',
                    borderRadius: 8
                }}
                dangerouslySetInnerHTML={{ __html: day.description }}
            />
        )
    }));

    return (
        <Card title={<span style={{ fontSize: 20, fontWeight: 'bold' }}>LỊCH TRÌNH</span>} style={{ marginBottom: 24 }}>
            <Collapse
                items={items}
                defaultActiveKey={['1']}
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                style={{
                    background: '#fff',
                    border: 'none'
                }}
            />
        </Card>
    );
};

export default ComboItinerary;
