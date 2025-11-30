import { useState, useEffect } from 'react';
import { Modal, Button, Input, Table, Space, Typography, Row, Col, notification, message } from 'antd';
import { SearchOutlined, ReloadOutlined, CloseOutlined, SendOutlined, CheckOutlined } from '@ant-design/icons';
import LoadingModal from '../../../components/LoadingModal';
import discountAPI from '../../../api/discount/discountAPI';
import itemDiscountAPI from '../../../api/itemDiscount/itemDiscountAPI';
import Constants from '../../../Constants/Constants';
import DiscountFilter from '../../../DTO/Discounts/SearchDiscounts/SearchDiscountFilter';

const { Title } = Typography;

const AssignDiscountButton = ({ entityId, entityType }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedCoupons, setSelectedCoupons] = useState([]);
    const [listDiscount, setListDiscount] = useState([]);
    const [filter, setFilter] = useState(new DiscountFilter());
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);

    // Hooks for message and modal
    const [messageApi, messageContext] = message.useMessage();
    const [modal, modalContext] = Modal.useModal();

    const handleOpenModal = () => {
        setIsModalVisible(true);
        setFilter(new DiscountFilter());
        setCurrentPage(1);
        setSelectedRowKeys([]);
        setSelectedCoupons([]);
    };

    const handleCancel = () => {
        setSelectedRowKeys([]);
        setSelectedCoupons([]);
        setCurrentPage(1);
        setIsModalVisible(false);
        setFilter(new DiscountFilter());
    };

    useEffect(() => {
        if (isModalVisible) {
            searchData(0);
        }
    }, [isModalVisible]);

    const handleSave = async () => {
        LoadingModal.showLoading();
        try {
            const request = {
                listDiscountId: selectedRowKeys,
                itemId: entityId,
                itemType: entityType
            };
            const res = await itemDiscountAPI.assignToItem(request);
            if (res.success) {
                messageApi.success(`Áp dụng thành công! Đã áp dụng ${selectedCoupons.length} mã giảm giá cho item.`);
                handleCancel();
            } else {
                messageApi.error(res.message || 'Có lỗi xảy ra khi áp dụng mã giảm giá.');
            }
        } catch (error) {
            console.error('Error assigning discounts:', error);
            messageApi.error(error.message || 'Có lỗi xảy ra khi kết nối đến server.');
        } finally {
            LoadingModal.hideLoading();
        }
    };

    const onSelectChange = (newKeys, rows) => {
        setSelectedRowKeys(newKeys);
        setSelectedCoupons(rows);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange
    };

    const searchData = async (pageIndex = 0) => {
        try {
            LoadingModal.showLoading();
            const filterReq = { ...filter, entityId, entityType };
            const request = {
                PageIndex: pageIndex,
                PageSize: Constants.DEFAULT_PAGE_SIZE,
                Filter: filterReq
            };
            const res = await discountAPI.getByEntityType(request);
            if (res.success) {
                const list = res.listDiscount ?? [];
                setListDiscount(list);
                setTotal(res.meta?.totalCount ?? list.length);
                setCurrentPage(pageIndex + 1);
                const defaultCheckedIds = list.filter((x) => x.checked).map((x) => x.id);
                setSelectedRowKeys(defaultCheckedIds);
                setSelectedCoupons(list.filter((x) => x.checked));
            } else {
                messageApi.error(res.message || 'Không thể tải danh sách mã giảm giá.');
            }
        } catch (err) {
            console.error('Error fetching discount list:', err);
            messageApi.error('Có lỗi xảy ra khi kết nối đến server.');
        } finally {
            LoadingModal.hideLoading();
        }
    };

    const handleSearch = () => {
        setCurrentPage(1);
        searchData(0);
    };

    const handleReset = () => {
        setFilter(new DiscountFilter());
        setSelectedRowKeys([]);
        setSelectedCoupons([]);
        setCurrentPage(1);
        searchData(0);
    };

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
        searchData(pagination.current - 1);
    };

    const columns = [
        {
            title: 'STT',
            key: 'index',
            align: 'center',
            width: 60,
            render: (_, __, index) => (currentPage - 1) * Constants.DEFAULT_PAGE_SIZE + index + 1
        },
        {
            title: 'Mã giảm giá',
            dataIndex: 'code',
            key: 'code'
        },
        {
            title: 'Tên giảm giá',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Giá trị (%)',
            dataIndex: 'discountPercent',
            key: 'discountPercent',
            align: 'center',
            width: 120
        }
    ];

    return (
        <div>
            {/* MUST INCLUDE */}
            {messageContext}
            {modalContext}

            <Button type="primary" icon={<SendOutlined />} onClick={handleOpenModal} shape="round">
                Áp dụng mã giảm giá
            </Button>

            <Modal
                title={
                    <Title level={4} className="m-0 flex items-center text-indigo-700">
                        Áp dụng mã giảm giá
                    </Title>
                }
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={850}
                maskClosable={false}
                centered
                bodyStyle={{
                    maxHeight: '85vh',
                    overflowY: 'auto',
                    padding: '24px'
                }}
            >
                <div className="space-y-6">
                    <Row gutter={[16, 16]} align="bottom">
                        <Col xs={24} sm={12} md={8}>
                            <label className="text-sm font-medium text-gray-700">Tên Mã Giảm Giá</label>
                            <Input
                                placeholder="Nhập tên"
                                value={filter.Name ?? ''}
                                onChange={(e) => setFilter({ ...filter, Name: e.target.value })}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <label className="text-sm font-medium text-gray-700">Mã Giảm Giá</label>
                            <Input
                                placeholder="Nhập mã"
                                value={filter.Code ?? ''}
                                onChange={(e) => setFilter({ ...filter, Code: e.target.value })}
                            />
                        </Col>
                        <Col xs={24} md={8}>
                            <Space className="w-full justify-start md:justify-end">
                                <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                                    Tìm kiếm
                                </Button>
                                <Button icon={<ReloadOutlined />} onClick={handleReset}>
                                    Đặt lại
                                </Button>
                            </Space>
                        </Col>
                    </Row>

                    <div>
                        <div className="mb-2 mt-2">
                            <span className="font-semibold text-indigo-700">Đã chọn: </span>
                            <span className="ml-2 font-medium text-indigo-800">
                                {selectedCoupons.length > 0 ? selectedCoupons.map((c) => c.code).join(', ') : 'Chưa có mã nào được chọn'}
                            </span>
                        </div>

                        <Table
                            columns={columns}
                            dataSource={listDiscount}
                            rowKey="id"
                            rowSelection={rowSelection}
                            pagination={{
                                current: currentPage,
                                pageSize: Constants.DEFAULT_PAGE_SIZE,
                                total: total,
                                onChange: (page, pageSize) => handleTableChange({ current: page, pageSize }),
                                showSizeChanger: false,
                                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total}`
                            }}
                            scroll={{ y: 300 }}
                            bordered
                        />
                    </div>

                    <div className="d-flex justify-content-end">
                        <Space>
                            <Button type="primary" icon={<CheckOutlined />} onClick={handleSave}>
                                Áp dụng
                            </Button>
                            <Button danger icon={<CloseOutlined />} onClick={handleCancel}>
                                Hủy
                            </Button>
                        </Space>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AssignDiscountButton;
