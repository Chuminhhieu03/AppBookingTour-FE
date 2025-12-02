import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, message, Popconfirm } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import TourItineraryModal from './TourItineraryModal';
import { tourItineraryAPI } from '../../../api/tour/tourItineraryAPI';

const TourItineraryTable = ({ mode = 'local', tourId, dataSource = [], onDataChange, tourInfo = {}, readOnly = false }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [modalConfig, setModalConfig] = useState({
        visible: false,
        mode: 'create',
        selectedRecord: null
    });

    // --- LOGIC 1: FETCH DATA (API Mode) ---
    const fetchData = useCallback(async () => {
        if (!tourId || mode === 'local') return;

        setLoading(true);
        try {
            const response = await tourItineraryAPI.getByTourId(tourId);
            if (response.success) {
                setData(response.data || []);
            } else {
                message.error(response.message || 'Không thể tải dữ liệu lịch trình');
            }
        } catch (error) {
            console.error('Error fetching tour itineraries:', error);
            message.error('Đã xảy ra lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    }, [tourId, mode]);

    // --- LOGIC 2: SYNC DATA ---
    // API Mode: Chạy fetch khi tourId đổi
    useEffect(() => {
        if (mode === 'api') fetchData();
    }, [fetchData, mode]);

    // Local Mode: Sync từ props dataSource vào state nội bộ và sắp xếp theo dayNumber
    useEffect(() => {
        if (mode === 'local') {
            const sortedData = (dataSource || []).sort((a, b) => (a.dayNumber || 0) - (b.dayNumber || 0));
            setData(sortedData);
        }
    }, [mode, dataSource]);

    // --- HANDLERS ---
    const toggleModal = (visible, mode = 'create', record = null) => {
        setModalConfig({ visible, mode, selectedRecord: record });
    };

    const updateLocalData = (newData) => {
        // Sắp xếp dữ liệu theo dayNumber trước khi cập nhật
        const sortedData = newData.sort((a, b) => (a.dayNumber || 0) - (b.dayNumber || 0));
        setData(sortedData);
        if (onDataChange) onDataChange(sortedData);
    };

    const handleDelete = async (record, index) => {
        if (mode === 'local') {
            const newData = data.filter((_, idx) => idx !== index);
            updateLocalData(newData);
        } else {
            // API: Xóa server
            setLoading(true);
            try {
                const response = await tourItineraryAPI.delete(record.id);
                if (response.success) {
                    message.success('Xóa lịch trình thành công!');
                    fetchData();
                } else {
                    message.error(response.message || 'Không thể xóa');
                }
            } catch (error) {
                message.error('Lỗi khi xóa lịch trình');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleModalSave = async (formData) => {
        const { mode: currentModalMode, selectedRecord } = modalConfig;

        if (mode === 'local') {
            let newData = [...data];
            if (currentModalMode === 'create') {
                // Thêm mới (Giả lập ID để tránh lỗi key react)
                newData.push({ ...formData, id: Date.now() });
            } else {
                // Sửa: Tìm đúng vị trí của record đang chọn để update
                const targetIndex = data.indexOf(selectedRecord);
                if (targetIndex > -1) {
                    newData[targetIndex] = { ...selectedRecord, ...formData };
                }
            }
            updateLocalData(newData);
            toggleModal(false);
        } else {
            // API Mode
            setLoading(true);
            try {
                const apiCall =
                    currentModalMode === 'create'
                        ? tourItineraryAPI.create(formData, tourId)
                        : tourItineraryAPI.update(selectedRecord.id, formData);

                const response = await apiCall;
                if (response.success) {
                    message.success(currentModalMode === 'create' ? 'Thêm mới thành công!' : 'Cập nhật thành công!');
                    fetchData();
                    toggleModal(false);
                } else {
                    message.error(response.message || 'Thao tác thất bại');
                }
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    message.error(error.response.data.message);
                } else {
                    message.error('Đã xảy ra lỗi hệ thống.');
                }
            } finally {
                setLoading(false);
            }
        }
    };

    const columns = [
        {
            title: 'STT',
            key: 'index',
            width: 60,
            align: 'center',
            render: (_, __, index) => index + 1
        },
        {
            title: 'Ngày',
            dataIndex: 'dayNumber',
            key: 'dayNumber',
            width: 160,
            align: 'center',
            render: (day) => `Ngày ${day}`
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            align: 'center'
        },
        {
            title: 'Hoạt động',
            dataIndex: 'activity',
            key: 'activity',
            align: 'center',
            ellipsis: true
        },
        {
            title: 'Hành động',
            key: 'action',
            align: 'center',
            width: 150,
            fixed: 'right',
            render: (_, record, index) => (
                <Space size="small">
                    <Button
                        type="primary"
                        ghost
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => toggleModal(true, 'view', record)}
                        title="Xem chi tiết"
                    />
                    {!readOnly && (
                        <>
                            <Button
                                type="default"
                                size="small"
                                icon={<EditOutlined />}
                                onClick={() => toggleModal(true, 'edit', record)}
                                title="Chỉnh sửa"
                            />
                            <Popconfirm
                                title="Bạn có chắc muốn xóa lịch trình tour này?"
                                onConfirm={() => handleDelete(record, index)}
                                okText="Có"
                                cancelText="Không"
                            >
                                <Button type="primary" danger size="small" icon={<DeleteOutlined />} title="Xóa" />
                            </Popconfirm>
                        </>
                    )}
                </Space>
            )
        }
    ];

    return (
        <div>
            {!readOnly && (
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => toggleModal(true, 'create')}>
                        Thêm lịch trình
                    </Button>
                </div>
            )}

            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                rowKey={(record, index) => record.id || index}
                pagination={false}
                size="middle"
                bordered
                scroll={{ x: 700 }}
                locale={{ emptyText: 'Chưa có lịch trình nào' }}
            />

            <TourItineraryModal
                open={modalConfig.visible}
                mode={modalConfig.mode}
                initialData={modalConfig.selectedRecord}
                tourInfo={tourInfo}
                onSave={handleModalSave}
                onCancel={() => toggleModal(false)}
            />
        </div>
    );
};

export default TourItineraryTable;
