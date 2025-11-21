import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Spin, Pagination, message, Select } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { comboAPI } from '../../../api/combo/comboAPI';
import ItemFilter from '../components/ItemFilter';
import ItemCard from '../components/ItemCard';
import { createEmptyFilter, buildUrlParams, parseUrlParams } from '../../../utils/itemDataHelpers';
import Constants from '../../../Constants/Constants';

const { Option } = Select;

const ComboList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [comboData, setComboData] = useState({
        combos: [],
        meta: {
            totalCount: 0,
            page: 1,
            pageSize: Constants.DEFAULT_LIST_ITEM_PAGE_SIZE,
            totalPages: 1
        }
    });

    // Internal state for form inputs (controlled components)
    const [internalFilters, setInternalFilters] = useState(createEmptyFilter('combo'));

    const [queryParams, setQueryParams] = useState({
        pageIndex: 1,
        pageSize: Constants.DEFAULT_LIST_ITEM_PAGE_SIZE,
        filter: createEmptyFilter('combo')
    });

    const [sortOption, setSortOption] = useState(null);

    // Function to sort combos based on sort option
    const sortCombos = useCallback((combos, sortOption) => {
        if (!sortOption || !combos || combos.length === 0) return combos;

        const sortedCombos = [...combos];

        switch (sortOption) {
            case 'priceAsc':
                return sortedCombos.sort((a, b) => (a.basePriceAdult || 0) - (b.basePriceAdult || 0));
            case 'priceDesc':
                return sortedCombos.sort((a, b) => (b.basePriceAdult || 0) - (a.basePriceAdult || 0));
            case 'rating':
                return sortedCombos.sort((a, b) => (b.rating || b.averageRating || 0) - (a.rating || a.averageRating || 0));
            case 'name':
                return sortedCombos.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            default:
                return combos;
        }
    }, []);

    // API call function
    const handleApiCall = useCallback(async (params, sortOption = null) => {
        try {
            setLoading(true);
            const response = await comboAPI.searchCombosForCustomer(params);
            if (response.success) {
                // Keep original combo data without normalizing
                const combos = response.data.combos || [];

                const sortedCombos = sortCombos(combos, sortOption);
                setComboData({
                    combos: sortedCombos,
                    meta: response.data.meta
                });
            } else {
                message.error('Không thể tải danh sách combo');
                setComboData({
                    combos: [],
                    meta: {
                        totalCount: 0,
                        page: 1,
                        pageSize: Constants.DEFAULT_LIST_ITEM_PAGE_SIZE,
                        totalPages: 1
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching combos:', error);
            message.error('Đã xảy ra lỗi khi tải danh sách combo');
            setComboData({
                combos: [],
                meta: {
                    totalCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalPages: 1
                }
            });
        } finally {
            setLoading(false);
        }
    }, []);

    // Effect to handle URL search params changes and API calls
    useEffect(() => {
        const urlFilters = parseUrlParams(searchParams);
        const urlPage = searchParams.get('page');
        const urlPageSize = searchParams.get('pageSize');
        const urlSort = searchParams.get('sort');

        // Update sort option from URL
        setSortOption(urlSort || null);

        // Update internal filters from URL
        const mergedFilters = { ...createEmptyFilter('combo'), ...urlFilters };
        setInternalFilters(mergedFilters);

        // Update query params and call API
        const newQueryParams = {
            pageIndex: urlPage ? Number(urlPage) : 1,
            pageSize: urlPageSize ? Number(urlPageSize) : Constants.DEFAULT_LIST_ITEM_PAGE_SIZE,
            filter: mergedFilters
        };

        setQueryParams(newQueryParams);
        handleApiCall(newQueryParams, urlSort);
    }, [searchParams, handleApiCall]);

    // Handle filter change - update URL params
    const handleFilterChange = (newFilter) => {
        setInternalFilters(newFilter);

        const params = buildUrlParams(newFilter);

        // Reset to page 1 when filter changes
        params.set('page', '1');
        if (queryParams.pageSize !== 10) {
            params.set('pageSize', queryParams.pageSize.toString());
        }

        setSearchParams(params);
    };

    // Handle pagination change - update URL params
    const handlePaginationChange = (page, pageSize) => {
        const params = new URLSearchParams(searchParams);

        if (page > 1) {
            params.set('page', page.toString());
        } else {
            params.delete('page');
        }

        if (pageSize !== 10) {
            params.set('pageSize', pageSize.toString());
        } else {
            params.delete('pageSize');
        }

        setSearchParams(params);
    };

    // Handle sort change - frontend only, no API call
    const handleSortChange = (value) => {
        setSortOption(value);

        // Sort existing data without API call
        const currentCombos = comboData.combos || [];
        const sortedCombos = sortCombos(currentCombos, value);
        setComboData((prevData) => ({
            ...prevData,
            combos: sortedCombos
        }));
    };

    // Handle view details
    const handleViewDetails = (combo) => {
        console.log('View combo details:', combo.id);
        // TODO: Navigate to combo details page
        // Example: navigate(`/combo/${combo.id}`);
    };

    return (
        <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            <div
                style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    padding: '24px 16px'
                }}
            >
                <Row gutter={[24, 24]}>
                    {/* Filter sidebar - Always displayed first */}
                    <Col xs={24} sm={24} md={8} lg={6} xl={6}>
                        <ItemFilter type="combo" initialFilters={internalFilters} onFilterChange={handleFilterChange} />
                    </Col>

                    {/* Combo list content */}
                    <Col xs={24} sm={24} md={16} lg={18} xl={18}>
                        <div style={{ marginBottom: '16px', textAlign: 'right' }}>
                            <Select
                                value={sortOption}
                                onChange={handleSortChange}
                                style={{ width: 200, textAlign: 'left' }}
                                placeholder="Sắp xếp"
                                allowClear
                            >
                                <Option value="priceAsc">Giá tăng dần</Option>
                                <Option value="priceDesc">Giá giảm dần</Option>
                                <Option value="rating">Điểm đánh giá</Option>
                            </Select>
                        </div>

                        <Spin spinning={loading}>
                            {/* Combo cards list */}
                            <div style={{ marginBottom: '24px' }}>
                                {comboData.combos && comboData.combos.length > 0
                                    ? comboData.combos.map((combo) => (
                                          <div key={combo.id} style={{ marginBottom: '16px' }}>
                                              <ItemCard data={combo} type="combo" onViewDetails={handleViewDetails} />
                                          </div>
                                      ))
                                    : !loading && (
                                          <div
                                              style={{
                                                  textAlign: 'center',
                                                  padding: '60px 0',
                                                  color: '#999'
                                              }}
                                          >
                                              Không tìm thấy combo nào phù hợp với tiêu chí tìm kiếm
                                          </div>
                                      )}
                            </div>

                            {/* Pagination */}
                            {comboData.combos && comboData.combos.length > 0 && (
                                <div style={{ textAlign: 'center' }}>
                                    <Pagination
                                        current={comboData.meta.page}
                                        total={comboData.meta.totalCount}
                                        pageSize={comboData.meta.pageSize}
                                        onChange={handlePaginationChange}
                                        showSizeChanger
                                        showQuickJumper
                                        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} combos`}
                                        pageSizeOptions={['10', '15', '20']}
                                    />
                                </div>
                            )}
                        </Spin>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default ComboList;
