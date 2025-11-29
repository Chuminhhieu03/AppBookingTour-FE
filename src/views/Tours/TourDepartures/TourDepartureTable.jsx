import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, message, Tag, Popconfirm } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import TourDepartureModal from './TourDepartureModal';
import { tourDepartureAPI } from '../../../api/tour/tourDepartureAPI';
import Constants from '../../../Constants/Constants';
import Utility from '../../../utils/Utility';

const TourDepartureTable = ({ mode = 'local', tourId, dataSource = [], onDataChange, tourInfo = {}, guides = [], readOnly = false }) => {
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
            const response = await tourDepartureAPI.getByTourId(tourId);
            if (response.success) {
                setData(response.data || []);
            } else {
                message.error(response.message || 'Không thể tải dữ liệu');
            }
        } catch (error) {
            console.error('Error:', error);
            message.error('Lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    }, [tourId, mode]);

    // --- LOGIC 2: SYNC DATA ---
    useEffect(() => {
        if (mode === 'api') fetchData();
    }, [fetchData, mode]);

    useEffect(() => {
        if (mode === 'local') {
            const sortedData = (dataSource || []).sort((a, b) => {
                if (!a.departureDate || !b.departureDate) return 0;
                return new Date(a.departureDate) - new Date(b.departureDate);
            });
            setData(sortedData);
        }
    }, [mode, dataSource]);

    // --- HELPER HANDLERS ---
    const toggleModal = (visible, mode = 'create', record = null) => {
        setModalConfig({ visible, mode, selectedRecord: record });
    };

    const updateLocalData = (newData) => {
        // Sắp xếp dữ liệu theo departureDate trước khi cập nhật
        const sortedData = newData.sort((a, b) => {
            if (!a.departureDate || !b.departureDate) return 0;
            return new Date(a.departureDate) - new Date(b.departureDate);
        });
        setData(sortedData);
        onDataChange?.(sortedData);
    };

    const handleAdd = () => {
        // Validate Tour Info
        if (!tourInfo?.durationDays || !tourInfo?.durationNights) {
            message.warning('Vui lòng nhập số ngày và số đêm lưu trú trước!');
            tourInfo?.onNavigateToBasicTab?.(); // Optional chaining cho an toàn
            return;
        }
        toggleModal(true, 'create');
    };

    const handleDelete = async (record, index) => {
        if (mode === 'local') {
            const newData = data.filter((_, idx) => idx !== index);
            updateLocalData(newData);
        } else {
            setLoading(true);
            try {
                const response = await tourDepartureAPI.delete(record.id);
                if (response.success) {
                    message.success('Xóa thành công!');
                    fetchData();
                } else {
                    message.error(response.message || 'Không thể xóa');
                }
            } catch (error) {
                message.error('Lỗi hệ thống khi xóa');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleModalSave = async (formData) => {
        const { mode: currentMode, selectedRecord } = modalConfig;

        if (mode === 'local') {
            let newData = [...data];
            if (currentMode === 'create') {
                // Tạo ID giả lập để tránh lỗi key
                newData.push({ ...formData, id: Date.now() });
            } else {
                const targetIndex = data.indexOf(selectedRecord);
                if (targetIndex > -1) newData[targetIndex] = { ...selectedRecord, ...formData };
            }
            updateLocalData(newData);
            toggleModal(false);
        } else {
            setLoading(true);
            try {
                const apiCall =
                    currentMode === 'create'
                        ? tourDepartureAPI.create(formData, tourId)
                        : tourDepartureAPI.update(selectedRecord.id, formData);

                const response = await apiCall;
                if (response.success) {
                    message.success(currentMode === 'create' ? 'Thêm mới thành công!' : 'Cập nhật thành công!');
                    fetchData();
                    toggleModal(false);
                } else {
                    message.error(response.message || 'Thao tác thất bại');
                }
            } catch (error) {
                message.error('Đã xảy ra lỗi hệ thống');
            } finally {
                setLoading(false);
            }
        }
    };

    // --- RENDER HELPERS ---
    const getStatusTag = (status) => {
        const option = Constants.TourDepartureStatusOptions.find((o) => o.value === status);
        return <Tag color={Utility.getTagColor('tourDepartureStatus', status)}>{option?.label || 'N/A'}</Tag>;
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
            title: 'Ngày đi',
            dataIndex: 'departureDate',
            key: 'departureDate',
            align: 'center',
            render: (date) => (date ? dayjs(date).format('DD/MM/YYYY') : '--')
        },
        {
            title: 'Ngày về',
            dataIndex: 'returnDate',
            key: 'returnDate',
            align: 'center',
            render: (date) => (date ? dayjs(date).format('DD/MM/YYYY') : '--')
        },
        {
            title: 'Giá người lớn',
            dataIndex: 'priceAdult',
            key: 'priceAdult',
            align: 'center',
            render: (price) => Utility.formatPrice(price || 0)
        },
        {
            title: 'Giá trẻ em',
            dataIndex: 'priceChildren',
            key: 'priceChildren',
            align: 'center',
            render: (price) => Utility.formatPrice(price || 0)
        },
        {
            title: 'Chỗ còn lại',
            dataIndex: 'availableSlots',
            key: 'availableSlots',
            align: 'center'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: getStatusTag
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
                                title="Bạn có chắc muốn xóa lịch khởi hành này?"
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
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                        Thêm lịch khởi hành
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
                locale={{ emptyText: 'Chưa có lịch khởi hành nào' }}
            />

            <TourDepartureModal
                open={modalConfig.visible}
                mode={modalConfig.mode}
                initialData={modalConfig.selectedRecord}
                tourInfo={tourInfo}
                guides={guides}
                onSave={handleModalSave}
                onCancel={() => toggleModal(false)}
            />
        </div>
    );
};

export default TourDepartureTable;
