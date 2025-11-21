import { Card, Collapse } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

const ComboImportantInfo = ({ combo }) => {
    // Ensure includes and excludes are arrays
    const includes = Array.isArray(combo?.includes)
        ? combo.includes
        : [
              'Vé máy bay khứ hồi',
              'Khách sạn 3-4 sao',
              'Các bữa ăn theo chương trình',
              'Vé tham quan theo chương trình',
              'Hướng dẫn viên nhiệt tình',
              'Bảo hiểm du lịch'
          ];

    const excludes = Array.isArray(combo?.excludes)
        ? combo.excludes
        : ['Chi phí cá nhân ngoài chương trình', 'Thuế VAT', 'Phụ thu phòng đơn', 'Tiền tip hướng dẫn viên'];

    const termsConditions = Array.isArray(combo?.termsConditions)
        ? combo.termsConditions
        : [
              'Công ty có quyền thay đổi lịch trình khi có sự cố bất khả kháng',
              'Giá tour có thể thay đổi tùy theo thời điểm đặt',
              'Mọi tranh chấp sẽ được giải quyết theo pháp luật Việt Nam',
              'Quý khách vui lòng đọc kỹ điều khoản trước khi đặt tour'
          ];

    const sections = [
        {
            key: '1',
            label: 'Giá tour bao gồm',
            content: includes
        },
        {
            key: '2',
            label: 'Giá tour không bao gồm',
            content: excludes
        },
        {
            key: '3',
            label: 'Điều kiện thanh toán',
            content: [
                'Đặt cọc 30% giá tour khi đăng ký',
                'Thanh toán 70% còn lại trước 7 ngày khởi hành',
                'Thanh toán qua chuyển khoản hoặc tiền mặt'
            ]
        },
        {
            key: '4',
            label: 'Điều kiện hủy tour',
            content: [
                'Hủy trước 15 ngày: Hoàn lại 70% tiền cọc',
                'Hủy trước 7-14 ngày: Hoàn lại 50% tiền cọc',
                'Hủy trước 3-6 ngày: Hoàn lại 30% tiền cọc',
                'Hủy trong vòng 2 ngày: Không hoàn tiền'
            ]
        },
        {
            key: '5',
            label: 'Giấy tờ cần mang theo',
            content: [
                'CMND/CCCD hoặc hộ chiếu còn hạn',
                'Giấy khai sinh (đối với trẻ em dưới 14 tuổi)',
                'Sổ hộ khẩu (nếu có yêu cầu)',
                'Vé máy bay và voucher khách sạn (công ty sẽ cung cấp)'
            ]
        },
        {
            key: '6',
            label: 'Hành lý',
            content: [
                'Hành lý xách tay: Tối đa 7kg',
                'Hành lý ký gửi: Tối đa 20kg (tùy hãng bay)',
                'Mang theo thuốc cá nhân, đồ dùng cá nhân',
                'Quần áo phù hợp với thời tiết điểm đến'
            ]
        },
        {
            key: '7',
            label: 'Lưu ý quan trọng',
            content: [
                'Vui lòng có mặt trước giờ khởi hành 30 phút',
                'Giữ gìn vệ sinh chung, không xả rác bừa bãi',
                'Không mang theo các vật dụng cấm theo quy định',
                'Tuân thủ nội quy, hướng dẫn của HDV',
                'Trẻ em dưới 2 tuổi: 10% giá tour, không có chỗ ngồi riêng'
            ]
        },
        {
            key: '8',
            label: 'Chính sách trẻ em',
            content: [
                'Trẻ em dưới 2 tuổi: 10% giá tour (không ghế ngồi riêng)',
                'Trẻ em từ 2-5 tuổi: 50% giá tour (ngủ chung giường người lớn)',
                'Trẻ em từ 6-11 tuổi: 75% giá tour (có ghế ngồi riêng)',
                'Trẻ em từ 12 tuổi trở lên: 100% giá tour như người lớn'
            ]
        },
        {
            key: '9',
            label: 'Điều khoản và điều kiện',
            content: termsConditions
        }
    ];

    const items = sections.map((section) => ({
        key: section.key,
        label: <span style={{ fontSize: 15, fontWeight: 600, color: '#2C3E50' }}>{section.label}</span>,
        children: (
            <ul style={{ paddingLeft: 20, margin: 0 }}>
                {section.content.map((item, index) => (
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
                    <InfoCircleOutlined style={{ marginRight: 8, color: '#1E88E5' }} />
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
