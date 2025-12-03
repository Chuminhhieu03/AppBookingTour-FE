import React, { useEffect } from 'react';
import { Table, Tag, Col, Row, Input, Flex, Button, Space, Select, Modal, message } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import MainCard from 'components/MainCard';
import SearchDiscountQuery from '../../DTO/Discounts/SearchDiscounts/SearchDiscountQuery';
import DiscountFilter from '../../DTO/Discounts/SearchDiscounts/SearchDiscountFilter';
import Constants from '../../Constants/Constants';
import LoadingModal from '../../components/LoadingModal';
import axiosIntance from '../../api/axiosInstance';
import discountAPI from '../../api/discount/discountAPI';
import Utility from '../../Utils/Utility';

export default function Default() {
    const [query, setQuery] = React.useState(new SearchDiscountQuery());
    const [filter, setFilter] = React.useState(new DiscountFilter());
    const [listDiscount, setListDiscount] = React.useState([]);
    const [listStatus, setListStatus] = React.useState([]);
    const [total, setTotal] = React.useState(0);
    const [currentPage, setCurrentPage] = React.useState(1);

    const columns = [
        {
            title: 'STT',
            key: 'index',
            render: (_, __, index) => (currentPage - 1) * Constants.DEFAULT_PAGE_SIZE + index + 1
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
            title: 'Số tiền giảm tối đa (VND)',
            dataIndex: 'maximumDiscount',
            key: 'maximumDiscount',
            align: 'right',
            render: (value) => (value != null ? Intl.NumberFormat('vi-VN').format(value) : '')
        },
        {
            title: 'Dịch vụ áp dụng',
            dataIndex: 'serviceTypeName',
            key: 'serviceTypeName'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (_, record) => (
                <Tag color={Utility.getLabelByValue(Constants.StatusColor, Boolean(record.status))}>
                    {Utility.getLabelByValue(Constants.StatusOptions, Boolean(record.status))}
                </Tag>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Button type="link" size="small" icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
                </Space>
            )
        }
    ];

    useEffect(() => {
        searchData(0);
        setupDefault();
    }, []);

    const setupDefault = async () => {
        try {
            const response = await axiosIntance.post('/Discount/setup-default', {});
            if (response.data.success) {
                setListStatus(response.data.listStatus);
            } else {
                message.error('Không thể tải danh sách trạng thái.');
            }
        } catch (error) {
            console.error('Error setting up default:', error);
            message.error('Đã xảy ra lỗi khi tải danh sách trạng thái.');
        }
    };

    const handleDelete = async (id) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa mã giảm giá này?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    const response = await discountAPI.delete(id);
                    if (response.success) {
                        message.success('Xóa mã giảm giá thành công');
                        searchData(currentPage - 1);
                    } else {
                        message.error(response.message || 'Không thể xóa mã giảm giá');
                    }
                } catch (error) {
                    console.error('Error deleting discount:', error);
                    message.error('Đã xảy ra lỗi khi xóa mã giảm giá');
                }
            }
        });
    };

    const searchData = async (pageIndex = 0) => {
        try {
            LoadingModal.showLoading();
            const request = {
                PageIndex: pageIndex,
                PageSize: Constants.DEFAULT_PAGE_SIZE,
                DiscountFilter: { ...filter }
            };
            const res = await discountAPI.search(request);
            if (res.success) {
                setListDiscount(res.listDiscount ?? []);
                setTotal(res.meta?.totalCount ?? res.listDiscount?.length ?? 0);
                setCurrentPage(pageIndex + 1);
            } else {
                message.error(res.message || 'Không thể tải danh sách mã giảm giá');
            }
        } catch (error) {
            console.error('Error fetching discounts:', error);
            message.error('Đã xảy ra lỗi khi tải danh sách mã giảm giá');
        } finally {
            LoadingModal.hideLoading();
        }
    };

    const onReset = () => {
        setFilter(new DiscountFilter());
        setQuery(new SearchDiscountQuery());
        setCurrentPage(1);
        searchData(0);
    };

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
        searchData(pagination.current - 1);
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
                                <Input value={filter.Code} onChange={(e) => setFilter({ ...filter, Code: e.target.value })} />
                            </Flex>
                        </Col>
                        <Col span={6}>
                            <Flex gap="small" align="center">
                                <span>Tên mã</span>
                                <Input
                                    style={{ flex: 1 }}
                                    value={filter.Name}
                                    onChange={(e) => setFilter({ ...filter, Name: e.target.value })}
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
                                    onChange={(val) => setFilter({ ...filter, Status: val })}
                                />
                            </Flex>
                        </Col>
                        <Col span={6}>
                            <Row justify="end">
                                <Space>
                                    <Button type="primary" icon={<SearchOutlined />} shape="round" onClick={() => searchData(0)}>
                                        Tìm kiếm
                                    </Button>
                                    <Button type="primary" icon={<ReloadOutlined />} shape="round" onClick={onReset}>
                                        Reset
                                    </Button>
                                </Space>
                            </Row>
                        </Col>
                    </Row>
                    <h6 className="mb-3">Tổng số bản ghi: {total}</h6>
                    <Table
                        dataSource={listDiscount}
                        columns={columns}
                        rowKey={(record) => record.id}
                        bordered
                        pagination={{
                            current: currentPage,
                            pageSize: Constants.DEFAULT_PAGE_SIZE,
                            total: total,
                            onChange: (page, pageSize) => handleTableChange({ current: page, pageSize }),
                            showSizeChanger: false,
                            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total}`
                        }}
                    />
                </MainCard>
            </Col>
        </Row>
    );
}
