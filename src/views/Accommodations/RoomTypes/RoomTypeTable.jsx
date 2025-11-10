import { Button, Space, Table, Tag } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { render } from 'sass';
import Utility from '../../../Utils/Utility';
import Constants from '../../../Constants/Constants';

const PAGE_SIZE = 5;

export default function RoomTypeTable({ listRoomType, onRoomTypeClick, onRoomTypeEditClick, viewOnly = false }) {
    const [page, setPage] = useState(1);

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
                <Button type="link" onClick={() => onRoomTypeClick(record)} style={{ padding: 0 }}>
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
            title: 'Trạng thái',
            dataIndex: 'statusName',
            align: 'center',
            key: 'statusName',
            render: (_, record) => <Tag color={Utility.getLabelByValue(Constants.StatusColor, record.status)}>{Utility.getLabelByValue(Constants.StatusOptions, record.status)}</Tag>
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
                        <Button type="link" icon={<DeleteOutlined />} />
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
