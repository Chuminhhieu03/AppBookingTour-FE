import { Card, Collapse } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

const ComboImportantInfo = ({ combo }) => {
    // Parse importantInfo from combo data
    const getSections = () => {
        if (!combo.importantInfo) {
            // Fallback to default sections if no importantInfo
            return [
                {
                    key: '1',
                    title: 'Giá tour bao gồm',
                    items: Array.isArray(combo?.includes)
                        ? combo.includes
                        : [
                              'Vé máy bay khứ hồi',
                              'Khách sạn 3-4 sao',
                              'Các bữa ăn theo chương trình',
                              'Vé tham quan theo chương trình',
                              'Hướng dẫn viên nhiệt tình',
                              'Bảo hiểm du lịch'
                          ]
                },
                {
                    key: '2',
                    title: 'Giá tour không bao gồm',
                    items: Array.isArray(combo?.excludes)
                        ? combo.excludes
                        : ['Chi phí cá nhân ngoài chương trình', 'Thuế VAT', 'Phụ thu phòng đơn', 'Tiền tip hướng dẫn viên']
                },
                {
                    key: '3',
                    title: 'Điều kiện thanh toán',
                    items: [
                        'Đặt cọc 30% giá tour khi đăng ký',
                        'Thanh toán 70% còn lại trước 7 ngày khởi hành',
                        'Thanh toán qua chuyển khoản hoặc tiền mặt'
                    ]
                },
                {
                    key: '4',
                    title: 'Điều kiện hủy tour',
                    items: [
                        'Hủy trước 15 ngày: Hoàn lại 70% tiền cọc',
                        'Hủy trước 7-14 ngày: Hoàn lại 50% tiền cọc',
                        'Hủy trước 3-6 ngày: Hoàn lại 30% tiền cọc',
                        'Hủy trong vòng 2 ngày: Không hoàn tiền'
                    ]
                },
                {
                    key: '5',
                    title: 'Giấy tờ cần mang theo',
                    items: [
                        'CMND/CCCD hoặc hộ chiếu còn hạn',
                        'Giấy khai sinh (đối với trẻ em dưới 14 tuổi)',
                        'Sổ hộ khẩu (nếu có yêu cầu)',
                        'Vé máy bay và voucher khách sạn (công ty sẽ cung cấp)'
                    ]
                },
                {
                    key: '6',
                    title: 'Hành lý',
                    items: [
                        'Hành lý xách tay: Tối đa 7kg',
                        'Hành lý ký gửi: Tối đa 20kg (tùy hãng bay)',
                        'Mang theo thuốc cá nhân, đồ dùng cá nhân',
                        'Quần áo phù hợp với thời tiết điểm đến'
                    ]
                },
                {
                    key: '7',
                    title: 'Lưu ý quan trọng',
                    items: [
                        'Vui lòng có mặt trước giờ khởi hành 30 phút',
                        'Giữ gìn vệ sinh chung, không xả rác bừa bãi',
                        'Không mang theo các vật dụng cấm theo quy định',
                        'Tuân thủ nội quy, hướng dẫn của HDV',
                        'Trẻ em dưới 2 tuổi: 10% giá tour, không có chỗ ngồi riêng'
                    ]
                },
                {
                    key: '8',
                    title: 'Chính sách trẻ em',
                    items: [
                        'Trẻ em dưới 2 tuổi: 10% giá tour (không ghế ngồi riêng)',
                        'Trẻ em từ 2-5 tuổi: 50% giá tour (ngủ chung giường người lớn)',
                        'Trẻ em từ 6-11 tuổi: 75% giá tour (có ghế ngồi riêng)',
                        'Trẻ em từ 12 tuổi trở lên: 100% giá tour như người lớn'
                    ]
                },
                {
                    key: '9',
                    title: 'Điều khoản và điều kiện',
                    items: Array.isArray(combo?.termsConditions)
                        ? combo.termsConditions
                        : [
                              'Công ty có quyền thay đổi lịch trình khi có sự cố bất khả kháng',
                              'Giá tour có thể thay đổi tùy theo thời điểm đặt',
                              'Mọi tranh chấp sẽ được giải quyết theo pháp luật Việt Nam',
                              'Quý khách vui lòng đọc kỹ điều khoản trước khi đặt tour'
                          ]
                }
            ];
        }

        try {
            const parsed = JSON.parse(combo.importantInfo);
            if (parsed && Array.isArray(parsed.sections)) {
                // Convert to format with keys for Collapse
                return parsed.sections.map((section, index) => ({
                    key: String(index + 1),
                    title: section.title,
                    items: section.items
                }));
            }
        } catch (e) {
            console.error('Failed to parse importantInfo:', e);
        }

        // Return empty array if parsing fails
        return [];
    };

    const sections = getSections();

    const items = sections.map((section) => ({
        key: section.key,
        label: <span style={{ fontSize: 15, fontWeight: 600, color: '#2C3E50' }}>{section.title}</span>,
        children: (
            <ul style={{ paddingLeft: 20, margin: 0 }}>
                {section.items.map((item, index) => (
                    <li key={index} style={{ marginBottom: 8, color: '#64748B', lineHeight: 1.6 }}>
                        {item}
                    </li>
                ))}
            </ul>
        )
    }));

    return (
        <Card
            title={
                <span style={{ fontSize: 20, fontWeight: 'bold' }}>
                    <InfoCircleOutlined style={{ marginRight: 8, color: '#04a9f5' }} />
                    THÔNG TIN QUAN TRỌNG
                </span>
            }
            style={{ marginBottom: 24 }}
        >
            <Collapse
                items={items}
                style={{
                    background: '#fff',
                    border: 'none'
                }}
            />
        </Card>
    );
};

export default ComboImportantInfo;
