import React, { useState, useEffect } from 'react';
import { Table, InputNumber, Button, DatePicker, Space, Modal, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import LoadingModal from '../../../../components/LoadingModal';
import roomInventoryAPI from '../../../../api/accommodation/roomInventoryAPI';

export default function RoomInventoryTable({ value = [], onChange, editable = true, roomTypeId }) {
    const [listRoomInventory, setListRoomInventory] = useState(Array.isArray(value) ? value : []);
    const [editingId, setEditingId] = useState(null); // Track the id of the row being edited
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    useEffect(() => {
        setListRoomInventory(Array.isArray(value) ? value : []);
    }, [value]);

    // Utility to validate row data
    const isValidRow = (row) => {
        return (
            row.date &&
            dayjs(row.date).isValid() &&
            row.basePrice != null &&
            row.basePrice >= 0 &&
            row.bookedRooms != null &&
            row.bookedRooms >= 0
        );
    };

    const updateRoomInventory = (id, field, val) => {
        const updated = listRoomInventory.map((item) => (item.id === id ? { ...item, [field]: val } : item));
        setListRoomInventory(updated);
        onChange?.(updated);
    };

    const handleAddRoomInventory = (newItem) => {
        if (!isValidRow(newItem)) {
            message.error('Vui lòng nhập đầy đủ và hợp lệ các trường: Ngày, Giá và Số phòng đã đặt');
            return;
        }

        Modal.confirm({
            title: 'Xác nhận thêm',
            content: 'Bạn có chắc chắn muốn thêm giảm giá đặc biệt này?',
            okText: 'Thêm',
            okType: 'primary',
            cancelText: 'Hủy',
            onOk: async () => {
                LoadingModal.showLoading();
                try {
                    const roomInventory = {
                        date: newItem.date,
                        basePrice: newItem.basePrice,
                        bookedRooms: newItem.bookedRooms,
                        ...(roomTypeId && { RoomTypeId: roomTypeId })
                    };
                    const data = { RoomInventory: roomInventory };
                    const response = await roomInventoryAPI.create(data);
                    if (response.success) {
                        message.success('Thêm giảm giá đặc biệt thành công');
                        const item = {
                            id: response.roomInventory?.id || -Date.now(), // Negative ID for local rows
                            date: newItem.date,
                            basePrice: newItem.basePrice,
                            bookedRooms: newItem.bookedRooms
                        };
                        const updated = [...listRoomInventory, item];
                        setListRoomInventory(updated);
                        onChange?.(updated);
                    } else {
                        message.error(response.message || 'Không thể thêm giảm giá đặc biệt');
                    }
                } catch (error) {
                    console.error('Error adding room inventory:', error);
                    message.error('Đã xảy ra lỗi khi thêm giảm giá đặc biệt');
                } finally {
                    LoadingModal.hideLoading();
                }
            }
        });
    };

    const handleDeleteRoomInventory = (id) => {
        const record = listRoomInventory.find((item) => item.id === id);
        if (!record) return;

        // Local-only rows have negative IDs
        if (record.id < 0) {
            const updated = listRoomInventory.filter((item) => item.id !== id);
            setListRoomInventory(updated);
            onChange?.(updated);
            return;
        }

        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa giảm giá đặc biệt này?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                LoadingModal.showLoading();
                try {
                    const response = await roomInventoryAPI.delete(record.id);
                    if (response.success) {
                        message.success('Xóa giảm giá đặc biệt thành công');
                        const updated = listRoomInventory.filter((item) => item.id !== id);
                        setListRoomInventory(updated);
                        onChange?.(updated);
                    } else {
                        message.error(response.message || 'Không thể xóa giảm giá đặc biệt');
                    }
                } catch (error) {
                    console.error('Error deleting room inventory:', error);
                    message.error('Đã xảy ra lỗi khi xóa giảm giá đặc biệt');
                } finally {
                    LoadingModal.hideLoading();
                }
            }
        });
    };

    const handleEdit = (id) => {
        setEditingId(id); // Set the id of the row to edit
    };

    const handleSave = (id) => {
        const record = listRoomInventory.find((item) => item.id === id);
        if (!record) return;

        if (!isValidRow(record)) {
            message.error('Vui lòng nhập đầy đủ và hợp lệ các trường: Ngày, Giá và Số phòng đã đặt');
            return;
        }

        if (record.id < 0) {
            // Local-only row
            setEditingId(null);
            message.success('Lưu thay đổi thành công');
            return;
        }

        Modal.confirm({
            title: 'Xác nhận sửa',
            content: 'Bạn có chắc chắn muốn lưu thay đổi này?',
            okText: 'Lưu',
            okType: 'primary',
            cancelText: 'Hủy',
            onOk: async () => {
                LoadingModal.showLoading();
                try {
                    const roomInventory = {
                        date: record.date,
                        basePrice: record.basePrice,
                        bookedRooms: record.bookedRooms,
                        ...(roomTypeId && { roomTypeId: roomTypeId })
                    };
                    const response = await roomInventoryAPI.update(record.id, roomInventory);
                    if (response.success) {
                        message.success('Cập nhật giảm giá đặc biệt thành công');
                        setEditingId(null);
                    } else {
                        message.error(response.message || 'Không thể cập nhật giảm giá đặc biệt');
                    }
                } catch (error) {
                    console.error('Error updating room inventory:', error);
                    message.error('Đã xảy ra lỗi khi cập nhật giảm giá đặc biệt');
                } finally {
                    LoadingModal.hideLoading();
                }
            }
        });
    };

    const handleCancel = () => {
        setEditingId(null); // Exit edit mode without reverting
    };

    const handleBulkDelete = () => {
        if (selectedRowKeys.length === 0) {
            message.warning('Vui lòng chọn ít nhất một mục để xóa');
            return;
        }

        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc chắn muốn xóa ${selectedRowKeys.length} mục đã chọn?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                LoadingModal.showLoading();
                try {
                    const response = await roomInventoryAPI.deleteBulk(selectedRowKeys);
                    if (response.success) {
                        message.success('Xóa thành công');
                        const updated = listRoomInventory.filter((item) => !selectedRowKeys.includes(item.id));
                        setListRoomInventory(updated);
                        onChange?.(updated);
                        setSelectedRowKeys([]);
                    } else {
                        message.error(response.message || 'Không thể xóa');
                    }
                } catch (error) {
                    console.error('Error deleting room inventories:', error);
                    message.error('Đã xảy ra lỗi khi xóa');
                } finally {
                    LoadingModal.hideLoading();
                }
            }
        });
    };

    const columns = [
        {
            title: 'STT',
            key: 'index',
            width: 60,
            align: 'center',
            render: (_, record, index) => {
                if (record.key === 'new') return '';
                return (currentPage - 1) * pageSize + index + 1;
            }
        },
        {
            title: 'Ngày',
            dataIndex: 'date',
            key: 'date',
            align: 'center',
            render: (value, record) => {
                if (!editable) {
                    return <span>{value ? dayjs(value).format('DD/MM/YYYY') : ''}</span>;
                }

                if (editingId === record.id) {
                    return (
                        <DatePicker
                            getPopupContainer={(trigger) => trigger.parentNode}
                            value={value ? dayjs(value) : null}
                            format="DD/MM/YYYY"
                            onChange={(date) => updateRoomInventory(record.id, 'date', date?.format('YYYY-MM-DD'))}
                        />
                    );
                }

                return <span>{value ? dayjs(value).format('DD/MM/YYYY') : ''}</span>;
            }
        },
        {
            title: 'Giá (VND)',
            dataIndex: 'basePrice',
            key: 'basePrice',
            align: 'right',
            render: (value, record) => {
                if (!editable) {
                    return <span>{value != null ? Intl.NumberFormat('vi-VN').format(value) : ''}</span>;
                }

                if (editingId === record.id) {
                    return (
                        <InputNumber
                            min={0}
                            value={value}
                            className="w-100"
                            formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(val) => val?.replace(/,/g, '')}
                            onChange={(val) => updateRoomInventory(record.id, 'basePrice', val)}
                        />
                    );
                }

                return <span>{value != null ? Intl.NumberFormat('vi-VN').format(value) : ''}</span>;
            }
        },
        {
            title: 'Số phòng đã đặt',
            dataIndex: 'bookedRooms',
            key: 'bookedRooms',
            align: 'center',
            render: (value, record) => {
                if (!editable) {
                    return <span>{value != null ? value : 0}</span>;
                }

                if (editingId === record.id) {
                    return (
                        <InputNumber
                            min={0}
                            value={value}
                            className="w-100"
                            onChange={(val) => updateRoomInventory(record.id, 'bookedRooms', val)}
                        />
                    );
                }

                return <span>{value != null ? value : 0}</span>;
            }
        },
        editable && {
            title: 'Chức năng',
            key: 'action',
            align: 'center',
            render: (_, record) => {
                const isEditing = editingId === record.id;
                return (
                    <Space>
                        {isEditing ? (
                            <>
                                <Button icon={<SaveOutlined />} type="link" onClick={() => handleSave(record.id)} />
                                <Button icon={<CloseOutlined />} type="link" onClick={() => handleCancel()} />
                            </>
                        ) : (
                            <>
                                <Button
                                    icon={<EditOutlined />}
                                    type="link"
                                    onClick={() => handleEdit(record.id)}
                                    disabled={editingId !== null}
                                />
                                <Button
                                    danger
                                    icon={<DeleteOutlined />}
                                    type="link"
                                    onClick={() => handleDeleteRoomInventory(record.id)}
                                    disabled={editingId !== null}
                                />
                            </>
                        )}
                    </Space>
                );
            }
        }
    ].filter(Boolean);

    const dataSource = listRoomInventory;

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys) => {
            setSelectedRowKeys(selectedKeys);
        },
        getCheckboxProps: (record) => ({
            disabled: editingId !== null, // Disable checkbox when editing
        }),
    };

    return (
        <div>
            {editable && selectedRowKeys.length > 0 && (
                <div style={{ marginBottom: 16, textAlign: 'right' }}>
                    <Button 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={handleBulkDelete}
                        disabled={editingId !== null}
                    >
                        Xóa {selectedRowKeys.length} mục đã chọn
                    </Button>
                </div>
            )}
            <Table
                dataSource={dataSource}
                columns={columns}
                rowKey={(record) => record.id || record.key} // Use id, fallback to key for new row
                rowSelection={rowSelection}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: dataSource.length,
                    showSizeChanger: true,
                    showTotal: (total) => `Tổng ${total} mục`,
                    pageSizeOptions: ['10', '20', '50', '100'],
                    onChange: (page, size) => {
                        setCurrentPage(page);
                        setPageSize(size);
                    }
                }}
                bordered
                size="small"
            />
        </div>
    );
}
