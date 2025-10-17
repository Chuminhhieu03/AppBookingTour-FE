import React, { useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Table, Tag } from 'antd';
import MainCard from 'components/MainCard';
import SearchDiscountQuery from '../../DTO/Discounts/SearchDiscounts/SearchDiscountQuery';
import Constants from '../../Constants/Constants';
import Utility from '../../utils/Utility';

export default function Default() {
    const [filter, setFilter] = React.useState(new SearchDiscountQuery());
    const [listDiscount, setListDiscount] = React.useState([]);

    const columns = [
        {
            title: 'STT',
            key: 'index',
            render: (_, __, index) => index + 1
        },
        {
            title: 'Mã',
            dataIndex: 'code',
            key: 'code',
            align: 'center'
        },
        {
            title: 'Tên mã giảm giá',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Ngày hiệu lực',
            dataIndex: 'startEffectedDtg',
            key: 'startEffectedDtg',
            align: 'center',
            render: (value) => Utility.formatDate(value)
        },
        {
            title: 'Ngày hết hiệu lực',
            dataIndex: 'endEffectedDtg',
            key: 'endEffectedDtg',
            align: 'center',
            render: (value) => Utility.formatDate(value)
        },
        {
            title: 'Giá trị giảm (%)',
            dataIndex: 'discountPercent',
            key: 'discountPercent'
        },
        {
            title: 'Dịch vụ áp dụng',
            dataIndex: 'appliedServices',
            key: 'appliedServices',
            render: (services) => services?.join(', ') || ''
        },
        {
            title: 'Trạng thái',
            dataIndex: 'statusName',
            key: 'statusName',
            align: 'center',
            render: (value, record) => {
               return record.status === Constants.Status.Active ? 
                <Tag color="green">{value}</Tag> : <Tag color="red">{value}</Tag>
            }
        }
    ];

    useEffect(() => {
        searchData(0);
    }, []);

    const searchData = async (pageIndex = 0) => {
        try {
            const request = { ...filter };
            request.PageIndex = pageIndex;
            request.PageSize = Constants.DEFAULT_PAGE_SIZE;
            const response = await fetch('https://localhost:44331/api/Discount/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(request)
            });
            const res = await response.json();
            console.log('Search results:', res);
            setListDiscount(res.listDiscount);
        } catch (error) {
            console.error('Error fetching discounts:', error);
        }
    };

    return (
        <Row>
            <Col xl={12}>
                <MainCard title="Danh sách mã giảm giá">
                    <Table
                        dataSource={listDiscount}
                        columns={columns}
                        rowKey={(record) => record.code || record.id}
                        pagination={{ pageSize: 10 }}
                        bordered
                    />
                </MainCard>
            </Col>
        </Row>
    );
}
