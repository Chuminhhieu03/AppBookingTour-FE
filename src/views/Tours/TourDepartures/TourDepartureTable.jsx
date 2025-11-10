import { Table, Button, Space, Card, Tag, message, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import tourDepartureAPI from '../../../api/tour/tourDepartureAPI';
import LoadingModal from '../../../components/LoadingModal';
import Constants from 'Constants/Constants';
import Utility from 'utils/Utility';

export default function TourDepartureTable({ tourId, isEditMode = false, title = 'Danh sách lịch khởi hành', tourData = null }) {
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

    const handleDelete = (departureId) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa lịch khởi hành này?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
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
            }
        });
    };

    const handleEdit = (record) => {
        navigate(`/admin/service/tour/${tourId}/departure/edit/${record.id}`);
    };

    const handleAdd = (tourData = null) => {
        navigate(`/admin/service/tour/${tourId}/departure/addnew`, {
            state: tourData
                ? {
                      duration: tourData.durationDays,
                      priceAdult: tourData.basePriceAdult,
                      priceChildren: tourData.basePriceChild,
                      maxParticipants: tourData.maxParticipants
                  }
                : null
        });
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
            render: (date) => <div style={{ textAlign: 'center' }}>{new Date(date).toLocaleDateString('vi-VN')}</div>
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
                    <Tag color={Utility.getTagColor('tourDepartureStatus', status)}>
                        {Utility.getLabelByValue(Constants.TourDepartureStatusOptions, status)}
                    </Tag>
                </div>
            )
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
                    onClick={() => navigate(`/admin/service/tour/${tourId}/departure/display/${record.id}`)}
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
            extra={
                isEditMode && (
                    <Button type="primary" icon={<PlusOutlined />} size="small" onClick={() => handleAdd(tourData)}>
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
                scroll={{ x: 900 }}
                locale={{
                    emptyText: 'Chưa có lịch khởi hành nào'
                }}
            />
        </Card>
    );
}
