import { Button, Table } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

export default function RoomTypeTable({ listRoomType }) {
    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (_, index) => index + 1
        },
        {
            title: 'Tên loại phòng',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Số lượng người lớn',
            dataIndex: 'maxAdult',
            key: 'maxAdult'
        },
        {
            title: 'Số lượng trẻ em',
            dataIndex: 'maxChild',
            key: 'maxChild'
        },
        {
            title: 'Giá phòng',
            dataIndex: 'price',
            key: 'price'
        },
        {
            title: 'Số lượng phòng',
            dataIndex: 'quantity',
            key: 'quantity'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            key: 'isActive'
        },
        {
            title: 'Chức năng',
            key: 'actions',
            align: 'center',
            width: 100,
            render: (_, record) => <Button type="link" icon={<DeleteOutlined />} />
        }
    ];
    return <Table columns={columns} dataSource={listRoomType} rowKey="id" pagination={{ pageSize: 5 }} />;
}
