import { Table, Button, Space, Card, Tag, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import tourDepartureAPI from '../../../api/tour/tourDepartureAPI';
import LoadingModal from '../../../components/LoadingModal';

export default function TourDepartureTable({ tourId, isEditMode = false, title = 'Danh sách lịch khởi hành' }) {
    const navigate = useNavigate();
    const [departures, setDepartures] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (tourId) {
            fetchDepartures();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tourId]);

    const fetchDepartures = async () => {
        try {
            setLoading(true);
            const response = await tourDepartureAPI.getByTourId(tourId);
            if (response.success) {
                setDepartures(response.data || []);
            }
        } catch (error) {
            console.error('Error fetching departures:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (departureId) => {
        try {
            const confirmed = window.confirm('Bạn có chắc chắn muốn xóa lịch khởi hành này?');
            if (!confirmed) return;

            LoadingModal.showLoading();
            const response = await tourDepartureAPI.delete(departureId);
            if (response.success) {
                message.success('Xóa lịch khởi hành thành công!');
                fetchDepartures(); // Refresh the list
            } else {
                message.error('Xóa lịch khởi hành thất bại!');
            }
        } catch (error) {
            console.error('Error deleting departure:', error);
            message.error('Đã xảy ra lỗi khi xóa lịch khởi hành.');
        } finally {
            LoadingModal.hideLoading();
        }
    };

    const handleEdit = (record) => {
        navigate(`/admin/service/tour/${tourId}/departure/edit/${record.id}`);
    };

    const handleAdd = () => {
        navigate(`/admin/service/tour/${tourId}/departure/addnew`);
    };

    const columns = [
        {
            title: 'STT',
            key: 'index',
            width: 60,
            onHeaderCell: () => ({ style: { textAlign: 'center' } }),
            render: (_, __, index) => <div style={{ textAlign: 'center' }}>{index + 1}</div>
        },
        {
            title: 'Ngày khởi hành',
            dataIndex: 'departureDate',
            key: 'departureDate',
            onHeaderCell: () => ({ style: { textAlign: 'center' } }),
            render: (date, record) => (
                <div style={{ textAlign: 'center' }}>
                    <Link to={`/admin/service/tour/${tourId}/departure/display/${record.id}`}>
                        {new Date(date).toLocaleDateString('vi-VN')}
                    </Link>
                </div>
            )
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'returnDate',
            key: 'returnDate',
            onHeaderCell: () => ({ style: { textAlign: 'center' } }),
            render: (date) => <div style={{ textAlign: 'center' }}>{new Date(date).toLocaleDateString('vi-VN')}</div>
        },
        {
            title: 'Giá người lớn',
            dataIndex: 'priceAdult',
            key: 'priceAdult',
            onHeaderCell: () => ({ style: { textAlign: 'center' } }),
            render: (price) => <div style={{ textAlign: 'right' }}>{price?.toLocaleString('vi-VN') + ' VND'}</div>
        },
        {
            title: 'Số chỗ còn lại',
            dataIndex: 'availableSlots',
            key: 'availableSlots',
            onHeaderCell: () => ({ style: { textAlign: 'center' } }),
            render: (slots) => <div style={{ textAlign: 'center' }}>{slots}</div>
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            onHeaderCell: () => ({ style: { textAlign: 'center' } }),
            render: (status) => (
                <div style={{ textAlign: 'center' }}>
                    <Tag color={status === 'Available' ? 'green' : status === 'Full' ? 'red' : status === 'Cancelled' ? 'gray' : 'orange'}>
                        {status === 'Available' ? 'Còn chỗ' : status === 'Full' ? 'Hết chỗ' : status === 'Cancelled' ? 'Đã hủy' : status}
                    </Tag>
                </div>
            )
        }
    ];

    // Add action column only in edit mode
    if (isEditMode) {
        columns.push({
            title: 'Chức năng',
            key: 'actions',
            align: 'center',
            width: 120,
            onHeaderCell: () => ({ style: { textAlign: 'center' } }),
            render: (_, record) => (
                <Space>
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} title="Chỉnh sửa" />
                    <Button type="link" icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} danger title="Xóa" />
                </Space>
            )
        });
    }

    return (
        <Card
            title={title}
            size="small"
            extra={
                isEditMode && (
                    <Button type="primary" icon={<PlusOutlined />} size="small" onClick={handleAdd}>
                        Thêm lịch khởi hành
                    </Button>
                )
            }
        >
            <Table
                columns={columns}
                dataSource={departures}
                rowKey="id"
                loading={loading}
                pagination={false}
                size="small"
                bordered
                scroll={{ x: isEditMode ? 900 : 800 }}
                locale={{
                    emptyText: 'Chưa có lịch khởi hành nào'
                }}
            />
        </Card>
    );
}
