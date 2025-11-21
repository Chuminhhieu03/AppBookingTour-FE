import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Spin, Pagination, message, Select } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { tourAPI } from '../../../api/tour/tourAPI';
import ItemFilter from '../components/ItemFilter';
import ItemCard from '../components/ItemCard';
import { createEmptyFilter, buildUrlParams, parseUrlParams } from '../../../utils/itemDataHelpers';
import Constants from '../../../Constants/Constants';

const { Option } = Select;

const TourList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [tourData, setTourData] = useState({
        tours: [],
        meta: {
            totalCount: 0,
            page: 1,
            pageSize: Constants.DEFAULT_LIST_ITEM_PAGE_SIZE,
            totalPages: 1
        }
    });

    // Internal state for form inputs (controlled components)
    const [internalFilters, setInternalFilters] = useState(createEmptyFilter('tour'));

    const [queryParams, setQueryParams] = useState({
        pageIndex: 1,
        pageSize: Constants.DEFAULT_LIST_ITEM_PAGE_SIZE,
        filter: createEmptyFilter('tour')
    });

    const [sortOption, setSortOption] = useState(null);

    // Function to sort tours based on sort option
    const sortTours = useCallback((tours, sortOption) => {
        if (!sortOption || !tours || tours.length === 0) return tours;

        const sortedTours = [...tours];

        switch (sortOption) {
            case 'priceAsc':
                return sortedTours.sort((a, b) => (a.basePriceAdult || 0) - (b.basePriceAdult || 0));
            case 'priceDesc':
                return sortedTours.sort((a, b) => (b.basePriceAdult || 0) - (a.basePriceAdult || 0));
            case 'rating':
                return sortedTours.sort((a, b) => (b.rating || b.averageRating || 0) - (a.rating || a.averageRating || 0));
            case 'name':
                return sortedTours.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            default:
                return tours;
        }
    }, []);

    // API call function
    const handleApiCall = useCallback(
        async (params, sortOption = null) => {
            try {
                setLoading(true);
                const response = await tourAPI.searchToursForCustomer(params);
                if (response.success) {
                    // Keep original tour data without normalizing
                    const tours = response.data.tours || [];

                    const sortedTours = sortTours(tours, sortOption);
                    setTourData({
                        tours: sortedTours,
                        meta: response.data.meta
                    });
                } else {
                    message.error('Không thể tải danh sách tour');
                    setTourData({
                        tours: [],
                        meta: {
                            totalCount: 0,
                            page: 1,
                            pageSize: Constants.DEFAULT_LIST_ITEM_PAGE_SIZE,
                            totalPages: 1
                        }
                    });
                }
            } catch (error) {
                console.error('Error fetching tours:', error);
                message.error('Đã xảy ra lỗi khi tải danh sách tour');
                setTourData({
                    tours: [],
                    meta: {
                        totalCount: 0,
                        page: 1,
                        pageSize: Constants.DEFAULT_LIST_ITEM_PAGE_SIZE,
                        totalPages: 1
                    }
                });
            } finally {
                setLoading(false);
            }
        },
        [sortTours]
    );

    // Effect to handle URL search params changes and API calls
    useEffect(() => {
        const urlFilters = parseUrlParams(searchParams);
        const urlPage = searchParams.get('page');
        const urlPageSize = searchParams.get('pageSize');
        const urlSort = searchParams.get('sort');

        // Update sort option from URL
        setSortOption(urlSort || null);

        // Update internal filters from URL
        const mergedFilters = { ...createEmptyFilter('tour'), ...urlFilters };
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
        const currentTours = tourData.tours || [];
        const sortedTours = sortTours(currentTours, value);
        setTourData((prevData) => ({
            ...prevData,
            tours: sortedTours
        }));
    };

    // Handle view details
    const handleViewDetails = (tour) => {
        console.log('View tour details:', tour.id);
        // TODO: Navigate to tour details page
        // Example: navigate(`/tour/${tour.id}`);
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
                        <ItemFilter type="tour" initialFilters={internalFilters} onFilterChange={handleFilterChange} />
                    </Col>

                    {/* Tour list content */}
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
                            {/* Tour cards list */}
                            <div style={{ marginBottom: '24px' }}>
                                {tourData.tours && tourData.tours.length > 0
                                    ? tourData.tours.map((tour) => (
                                          <div key={tour.id} style={{ marginBottom: '16px' }}>
                                              <ItemCard data={tour} type="tour" onViewDetails={handleViewDetails} />
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
                                              Không tìm thấy tour nào phù hợp với tiêu chí tìm kiếm
                                          </div>
                                      )}
                            </div>

                            {/* Pagination */}
                            {tourData.tours && tourData.tours.length > 0 && (
                                <div style={{ textAlign: 'center' }}>
                                    <Pagination
                                        current={tourData.meta.page}
                                        total={tourData.meta.totalCount}
                                        pageSize={tourData.meta.pageSize}
                                        onChange={handlePaginationChange}
                                        showSizeChanger
                                        showQuickJumper
                                        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} tours`}
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

export default TourList;
