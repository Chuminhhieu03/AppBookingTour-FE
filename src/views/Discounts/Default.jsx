import React, { useEffect } from 'react';
import { Table, Tag, Col, Row, Input, Flex, Button, Space, Select } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import MainCard from 'components/MainCard';
import SearchDiscountQuery from '../../DTO/Discounts/SearchDiscounts/SearchDiscountQuery';
import DiscountFilter from '../../DTO/Discounts/SearchDiscounts/SearchDiscountFilter';
import Constants from '../../Constants/Constants';
import Utility from '../../utils/Utility';
import LoadingModal from '../../components/LoadingModal';
import axiosIntance from '../../api/axiosInstance';

export default function Default() {
    const [query, setQuery] = React.useState(new SearchDiscountQuery());
    const [filter, setFilter] = React.useState(new DiscountFilter());
    const [listDiscount, setListDiscount] = React.useState([]);
    const [listStatus, setListStatus] = React.useState([]);
    const [isReset, setIsReset] = React.useState(false);

    const columns = [
        {
            title: 'STT',
            key: 'index',
            render: (_, __, index) => (filter.PageIndex ?? 0) * Constants.DEFAULT_PAGE_SIZE + index + 1
        },
        {
            title: 'Mã',
            dataIndex: 'code',
            key: 'code',
            align: 'center',
            render: (text, record) => <Link to={`/admin/sale/discount/display/${record.id}`}>{text}</Link>
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
            dataIndex: 'serviceTypeName',
            key: 'serviceTypeName'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'statusName',
            key: 'statusName',
            align: 'center',
            render: (value, record) => {
                return record.status === Constants.Status.Active ? <Tag color="green">{value}</Tag> : <Tag color="red">{value}</Tag>;
            }
        }
    ];

    useEffect(() => {
        searchData();
        setupDefault();
    }, []);

    useEffect(() => {
        if (filter && query && isReset) {
            searchData(0);
        }
    }, [filter, query, isReset]);

    const setupDefault = async () => {
        const response = await axiosIntance.post('/Discount/setup-default', {});
        const res = response.data;
        setListStatus(res.listStatus);
    };

    const searchData = async (pageIndex = 0) => {
        try {
            LoadingModal.showLoading();
            const request = { ...query };
            request.PageIndex = pageIndex;
            request.PageSize = Constants.DEFAULT_PAGE_SIZE;
            request.DiscountFilter = { ...filter };
            const response = await axiosIntance.post('/Discount/search', request);
            const res = response.data;
            setListDiscount(res.listDiscount);
            setIsReset(false);
        } catch (error) {
            console.error('Error fetching discounts:', error);
        } finally {
            LoadingModal.hideLoading();
        }
    };

    const onReset = () => {
        const newFilter = new DiscountFilter();
        const newQuery = new SearchDiscountQuery();
        setFilter(newFilter);
        setQuery(newQuery);
        setIsReset(!isReset);
    };

    return (
        <Row>
            <Col span={24}>
                <MainCard
                    title="Danh sách mã giảm giá"
                    secondary={
                        <Button type="primary" href="/admin/sale/discount/addnew" shape="round" icon={<PlusOutlined />}>
                            Tạo mã giảm giá
                        </Button>
                    }
                >
                    <Row gutter={[24, 24]} className="mb-5">
                        <Col span={6}>
                            <Flex gap="small" align="center">
                                <span>Mã</span>
                                <Input
                                    value={filter.Code}
                                    onChange={(e) => {
                                        filter.Code = e.target.value;
                                        setFilter({ ...filter });
                                    }}
                                />
                            </Flex>
                        </Col>
                        <Col span={6}>
                            <Flex gap="small" align="center">
                                <span>Tên mã</span>
                                <Input
                                    style={{ flex: 1 }}
                                    value={filter.Name}
                                    onChange={(e) => {
                                        filter.Name = e.target.value;
                                        setFilter({ ...filter });
                                    }}
                                />
                            </Flex>
                        </Col>
                        <Col span={6}>
                            <Flex gap="small" align="center">
                                <span>Trạng thái</span>
                                <Select
                                    value={filter.Status}
                                    allowClear
                                    style={{ flex: 1 }}
                                    options={listStatus?.map((item) => ({
                                        label: item.value,
                                        value: item.key
                                    }))}
                                    onChange={(val) => {
                                        filter.Status = val;
                                        setFilter({ ...filter });
                                    }}
                                />
                            </Flex>
                        </Col>
                        <Col span={6}>
                            <Row justify="end">
                                <Space>
                                    <Button type="primary" icon={<SearchOutlined />} shape="round" onClick={() => searchData()}>
                                        Tìm kiếm
                                    </Button>
                                    <Button type="primary" icon={<ReloadOutlined />} shape="round" onClick={() => onReset()}>
                                        Reset
                                    </Button>
                                </Space>
                            </Row>
                        </Col>
                    </Row>
                    <h6 className="mb-3">Tổng số bản ghi: {listDiscount?.length}</h6>
                    <Table
                        dataSource={listDiscount}
                        columns={columns}
                        rowKey={(record) => record.id}
                        bordered
                        pagination={{
                            pageSize: Constants.DEFAULT_PAGE_SIZE,
                            onChange: (page) => {
                                searchData(page - 1);
                                query.PageIndex = page - 1;
                                setQuery({ ...query });
                            }
                        }}
                    />
                </MainCard>
            </Col>
        </Row>
    );
}
