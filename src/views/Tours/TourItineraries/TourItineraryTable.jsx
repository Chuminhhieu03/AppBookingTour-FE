import { Table, Button, Space, Card, message, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

    const handleDelete = (itineraryId) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa lịch trình này?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
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
            }
        });
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
            render: (dayNumber) => <div style={{ textAlign: 'center' }}>{`Ngày ${dayNumber}`}</div>
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

    // Always add action column - show different buttons based on mode
    columns.push({
        title: 'Hành động',
        key: 'action',
        width: 150,
        align: 'center',
        fixed: 'right',
        onHeaderCell: () => ({ style: { textAlign: 'center' } }),
        render: (_, record) => (
            <Space size="small">
                <Button
                    type="primary"
                    ghost
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => navigate(`/admin/service/tour/${tourId}/itinerary/display/${record.id}`)}
                />
                {isEditMode && (
                    <>
                        <Button type="default" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                        <Button type="primary" danger size="small" icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
                    </>
                )}
            </Space>
        )
    });

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
                scroll={{ x: 700 }}
                locale={{
                    emptyText: 'Chưa có lịch trình chi tiết nào'
                }}
            />
        </Card>
    );
}
