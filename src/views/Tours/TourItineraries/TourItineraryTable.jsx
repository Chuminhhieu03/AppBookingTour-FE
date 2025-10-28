import { Table, Button, Space, Card, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import tourItineraryAPI from '../../../api/tour/tourItineraryAPI';
import LoadingModal from '../../../components/LoadingModal';

export default function TourItineraryTable({ tourId, isEditMode = false, title = 'Lịch trình chi tiết' }) {
    const navigate = useNavigate();
    const [itineraries, setItineraries] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (tourId) {
            fetchItineraries();
        }
    }, [tourId]);

    const fetchItineraries = async () => {
        try {
            setLoading(true);
            const response = await tourItineraryAPI.getByTourId(tourId);
            if (response.success) {
                setItineraries(response.data || []);
            }
        } catch (error) {
            console.error('Error fetching itineraries:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (itineraryId) => {
        try {
            const confirmed = window.confirm('Bạn có chắc chắn muốn xóa lịch trình này?');
            if (!confirmed) return;

            LoadingModal.showLoading();
            const response = await tourItineraryAPI.delete(itineraryId);
            if (response.success) {
                message.success('Xóa lịch trình thành công!');
                fetchItineraries(); // Refresh the list
            } else {
                message.error('Xóa lịch trình thất bại!');
            }
        } catch (error) {
            console.error('Error deleting itinerary:', error);
            message.error('Đã xảy ra lỗi khi xóa lịch trình.');
        } finally {
            LoadingModal.hideLoading();
        }
    };

    const handleEdit = (record) => {
        navigate(`/admin/service/tour/${tourId}/itinerary/edit/${record.id}`);
    };

    const handleAdd = () => {
        navigate(`/admin/service/tour/${tourId}/itinerary/addnew`);
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
            title: 'Ngày',
            dataIndex: 'dayNumber',
            key: 'dayNumber',
            width: 200,
            onHeaderCell: () => ({ style: { textAlign: 'center' } }),
            render: (dayNumber, record) => (
                <div style={{ textAlign: 'center' }}>
                    <Link to={`/admin/service/tour/${tourId}/itinerary/display/${record.id}`}>{`Ngày ${dayNumber}`}</Link>
                </div>
            )
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            onHeaderCell: () => ({ style: { textAlign: 'center' } }),
            render: (title) => <div style={{ textAlign: 'center' }}>{title}</div>
        },
        {
            title: 'Hoạt động',
            dataIndex: 'activity',
            key: 'activity',
            ellipsis: true,
            onHeaderCell: () => ({ style: { textAlign: 'center' } }),
            render: (activity) => <div style={{ textAlign: 'center' }}>{activity}</div>
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
            style={{ marginBottom: 24 }}
            extra={
                isEditMode && (
                    <Button type="primary" icon={<PlusOutlined />} size="small" onClick={handleAdd}>
                        Thêm lịch trình
                    </Button>
                )
            }
        >
            <Table
                columns={columns}
                dataSource={itineraries}
                rowKey="id"
                loading={loading}
                pagination={false}
                size="small"
                bordered
                scroll={{ x: isEditMode ? 700 : 600 }}
                locale={{
                    emptyText: 'Chưa có lịch trình chi tiết nào'
                }}
            />
        </Card>
    );
}
