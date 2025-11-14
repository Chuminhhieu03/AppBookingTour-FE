import React, { useState, useEffect } from 'react';
import { Table, InputNumber, Button, DatePicker, Space, Modal, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import LoadingModal from '../../../../components/LoadingModal';
import roomInventoryAPI from '../../../../api/accommodation/roomInventoryAPI';

export default function RoomInventoryTable({ value = [], onChange, editable = true, roomTypeId }) {
    const [listRoomInventory, setListRoomInventory] = useState(Array.isArray(value) ? value : []);
    const [editingId, setEditingId] = useState(null); // Track the id of the row being edited
    const [newRow, setNewRow] = useState({
        key: 'new',
        date: null,
        basePriceAdult: null,
        basePriceChildren: null
    });

    useEffect(() => {
        setListRoomInventory(Array.isArray(value) ? value : []);
    }, [value]);

    // Utility to validate row data
    const isValidRow = (row) => {
        return (
            row.date &&
            dayjs(row.date).isValid() &&
            row.basePriceAdult != null &&
            row.basePriceAdult >= 0 &&
            row.basePriceChildren != null &&
            row.basePriceChildren >= 0
        );
    };

    const updateRoomInventory = (id, field, val) => {
        const updated = listRoomInventory.map((item) => (item.id === id ? { ...item, [field]: val } : item));
        setListRoomInventory(updated);
        onChange?.(updated);
    };

    const handleAddRoomInventory = (newItem) => {
        if (!isValidRow(newItem)) {
            message.error('Vui lòng nhập đầy đủ và hợp lệ các trường: Ngày, Giá người lớn, Giá trẻ em');
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
                        basePriceAdult: newItem.basePriceAdult,
                        basePriceChildren: newItem.basePriceChildren,
                        ...(roomTypeId && { RoomTypeId: roomTypeId })
                    };
                    const data = { RoomInventory: roomInventory };
                    const response = await roomInventoryAPI.create(data);
                    if (response.success) {
                        message.success('Thêm giảm giá đặc biệt thành công');
                        const item = {
                            id: response.roomInventory?.id || -Date.now(), // Negative ID for local rows
                            date: newItem.date,
                            basePriceAdult: newItem.basePriceAdult,
                            basePriceChildren: newItem.basePriceChildren
                        };
                        const updated = [...listRoomInventory, item];
                        setListRoomInventory(updated);
                        onChange?.(updated);
                        setNewRow({ key: 'new', date: null, basePriceAdult: null, basePriceChildren: null });
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
            message.error('Vui lòng nhập đầy đủ và hợp lệ các trường: Ngày, Giá người lớn, Giá trẻ em');
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
                        basePriceAdult: record.basePriceAdult,
                        basePriceChildren: record.basePriceChildren,
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
            dataIndex: 'date',
            key: 'date',
            align: 'center',
            render: (value, record) => {
                if (!editable || record.key === 'new') {
                    return record.key === 'new' ? (
                        <DatePicker
                            value={newRow.date ? dayjs(newRow.date) : null}
                            format="DD/MM/YYYY"
                            onChange={(date) => setNewRow({ ...newRow, date: date?.format('YYYY-MM-DD') })}
                        />
                    ) : (
                        <span>{value ? dayjs(value).format('DD/MM/YYYY') : ''}</span>
                    );
                }

                if (editingId === record.id) {
                    return (
                        <DatePicker
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
            title: 'Giá người lớn (VND)',
            dataIndex: 'basePriceAdult',
            key: 'basePriceAdult',
            align: 'right',
            render: (value, record) => {
                if (!editable || record.key === 'new') {
                    return record.key === 'new' ? (
                        <InputNumber
                            min={0}
                            value={newRow.basePriceAdult}
                            className="w-100"
                            formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(val) => val?.replace(/,/g, '')}
                            onChange={(val) => setNewRow({ ...newRow, basePriceAdult: val })}
                        />
                    ) : (
                        <span>{value != null ? Intl.NumberFormat('vi-VN').format(value) : ''}</span>
                    );
                }

                if (editingId === record.id) {
                    return (
                        <InputNumber
                            min={0}
                            value={value}
                            className="w-100"
                            formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(val) => val?.replace(/,/g, '')}
                            onChange={(val) => updateRoomInventory(record.id, 'basePriceAdult', val)}
                        />
                    );
                }

                return <span>{value != null ? Intl.NumberFormat('vi-VN').format(value) : ''}</span>;
            }
        },
        {
            title: 'Giá trẻ em (VND)',
            dataIndex: 'basePriceChildren',
            key: 'basePriceChildren',
            align: 'right',
            render: (value, record) => {
                if (!editable || record.key === 'new') {
                    return record.key === 'new' ? (
                        <InputNumber
                            min={0}
                            value={newRow.basePriceChildren}
                            className="w-100"
                            formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(val) => val?.replace(/,/g, '')}
                            onChange={(val) => setNewRow({ ...newRow, basePriceChildren: val })}
                        />
                    ) : (
                        <span>{value != null ? Intl.NumberFormat('vi-VN').format(value) : ''}</span>
                    );
                }

                if (editingId === record.id) {
                    return (
                        <InputNumber
                            min={0}
                            value={value}
                            className="w-100"
                            formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(val) => val?.replace(/,/g, '')}
                            onChange={(val) => updateRoomInventory(record.id, 'basePriceChildren', val)}
                        />
                    );
                }

                return <span>{value != null ? Intl.NumberFormat('vi-VN').format(value) : ''}</span>;
            }
        },
        editable && {
            title: 'Chức năng',
            key: 'action',
            align: 'center',
            render: (_, record) => {
                if (record.key === 'new') {
                    const disabled = !isValidRow(newRow);
                    return (
                        <Button
                            icon={<PlusOutlined />}
                            type="dashed"
                            block
                            disabled={disabled}
                            onClick={() => handleAddRoomInventory(newRow)}
                        />
                    );
                }

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

    const dataSource = editable ? [...listRoomInventory, newRow] : listRoomInventory;

    return (
        <div style={{ marginTop: '20px' }}>
            <span>Danh sách giảm giá đặc biệt</span>
            <Table
                dataSource={dataSource}
                columns={columns}
                rowKey={(record) => record.id || record.key} // Use id, fallback to key for new row
                pagination={false}
                bordered
                size="small"
            />
        </div>
    );
}
