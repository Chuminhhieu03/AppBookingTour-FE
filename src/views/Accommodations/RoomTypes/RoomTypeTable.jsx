import { Button, Space, Table, Tag } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { render } from 'sass';
import Utility from '../../../Utils/Utility';
import Constants from '../../../Constants/Constants';
import roomTypeAPI from '../../../api/accommodation/roomTypeAPI';
import { useUI } from 'components/providers/UIProvider';

const PAGE_SIZE = 5;

export default function RoomTypeTable({ listRoomType, onRoomTypeClick, onRoomTypeEditClick, onRoomTypeDeleteClick, viewOnly = false }) {
    const [page, setPage] = useState(1);
    const { messageApi, modalApi } = useUI();

    const handleDelete = async (id) => {
        modalApi.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa loại phòng này?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    const response = await roomTypeAPI.delete(id);
                    if (response.success) {
                        messageApi.success('Xóa loại phòng thành công');
                        if (onRoomTypeDeleteClick) {
                            onRoomTypeDeleteClick();
                        }
                    } else {
                        messageApi.error(response.message || 'Không thể xóa loại phòng');
                    }
                } catch (error) {
                    console.error('Error deleting room type:', error);
                    messageApi.error('Đã xảy ra lỗi khi xóa loại phòng');
                }
            }
        });
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (_, __, index) => {
                return (page - 1) * PAGE_SIZE + index + 1;
            }
        },
        {
            title: 'Tên loại phòng',
            dataIndex: 'name',
            key: 'name',
            render: (name, record) => (
                <Button
                    type="link"
                    onClick={() => (viewOnly ? onRoomTypeClick(record) : onRoomTypeEditClick(record))}
                    style={{ padding: 0 }}
                >
                    {name}
                </Button>
            )
        },
        {
            title: 'Số lượng người lớn',
            dataIndex: 'maxAdult',
            key: 'maxAdult'
        },
        {
            title: 'Số lượng trẻ em',
            dataIndex: 'maxChildren',
            key: 'maxChildren'
        },
        {
            title: 'Số lượng phòng',
            dataIndex: 'quantity',
            key: 'quantity'
        },
        {
            title: 'Giá phòng',
            dataIndex: 'price',
            key: 'price',
            render: (value) => (
                <span style={{ display: 'block', textAlign: 'right' }}>
                    {Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}
                </span>
            )
        },
        {
            title: 'Diện tích (m²)',
            dataIndex: 'area',
            key: 'area',
            align: 'center',
            render: (value) => (value ? `${Intl.NumberFormat('vi-VN').format(value)}` : '-')
        },
        {
            title: 'Giờ nhận phòng',
            dataIndex: 'checkinHour',
            key: 'checkinHour',
            align: 'center',
            render: (value) => (value ? value.substring(0, 5) : '-')
        },
        {
            title: 'Giờ trả phòng',
            dataIndex: 'checkoutHour',
            key: 'checkoutHour',
            align: 'center',
            render: (value) => (value ? value.substring(0, 5) : '-')
        },
        {
            title: 'Trạng thái',
            dataIndex: 'statusName',
            align: 'center',
            key: 'statusName',
            render: (_, record) => (
                <Tag color={Utility.getLabelByValue(Constants.StatusColor, record.status)}>
                    {Utility.getLabelByValue(Constants.StatusOptions, record.status)}
                </Tag>
            )
        },
        !viewOnly && {
            title: 'Chức năng',
            key: 'actions',
            align: 'center',
            width: 100,
            render: (_, record) => (
                <>
                    <Space>
                        <Button type="link" icon={<EditOutlined />} onClick={() => onRoomTypeEditClick(record)} />
                        <Button type="link" icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
                    </Space>
                </>
            )
        }
    ].filter(Boolean);

    return (
        <Table
            columns={columns}
            dataSource={listRoomType}
            rowKey="id"
                pagination={{
                    pageSize: PAGE_SIZE,
                    onChange: (page) => {
                        setPage(page);
                    },
                current: page
            }}
        />
    );
}