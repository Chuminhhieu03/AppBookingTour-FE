import React, { useState, useEffect } from 'react';
import { Card, Form, Select, Slider, DatePicker, Button, message, InputNumber } from 'antd';
import { SearchOutlined, StarFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import cityAPI from '../../../api/city/cityAPI';
import tourTypeAPI from '../../../api/tour/tourTypeAPI';
import tourCategoryAPI from '../../../api/tour/tourCategoryAPI';
import Constants from '../../../Constants/Constants';
import Utility from '../../../utils/Utility';

const { Option } = Select;

const ItemFilter = ({ type, initialFilters, onFilterChange }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [cities, setCities] = useState([]);
    const [tourTypes, setTourTypes] = useState([]);
    const [tourCategories, setTourCategories] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 50000000]); // 0-50M VNĐ

    // Define filter fields based on type
    const getFilterConfig = () => {
        const baseConfig = {
            priceRange: true
        };

        switch (type) {
            case 'accommodation':
                return {
                    ...baseConfig,
                    cityId: true,
                    starRating: true,
                    type: true
                };

            case 'tour':
                return {
                    ...baseConfig,
                    departureCityId: true,
                    destinationCityId: true,
                    departureDate: true,
                    tourTypeId: true,
                    tourCategoryId: true
                };

            case 'combo':
                return {
                    ...baseConfig,
                    departureCityId: true,
                    destinationCityId: true,
                    departureDate: true,
                    vehicle: true
                };

            default:
                return baseConfig;
        }
    };

    const filterConfig = getFilterConfig();

    // Load data for dropdowns
    const loadData = async () => {
        try {
            setLoading(true);
            const promises = [];

            // Load cities if needed
            if (filterConfig.cityId || filterConfig.departureCityId || filterConfig.destinationCityId) {
                promises.push(cityAPI.getListCity());
            }

            // Load tour types if needed
            if (filterConfig.tourTypeId) {
                promises.push(tourTypeAPI.getList());
            }

            // Load tour categories if needed
            if (filterConfig.tourCategoryId) {
                promises.push(tourCategoryAPI.getList());
            }

            const responses = await Promise.all(promises);
            let responseIndex = 0;

            // Process cities response
            if (filterConfig.cityId || filterConfig.departureCityId || filterConfig.destinationCityId) {
                const citiesResponse = responses[responseIndex++];
                if (citiesResponse?.success) {
                    setCities(citiesResponse.data || []);
                }
            }

            // Process tour types response
            if (filterConfig.tourTypeId) {
                const tourTypesResponse = responses[responseIndex++];
                if (tourTypesResponse?.success) {
                    setTourTypes(tourTypesResponse.data || []);
                }
            }

            // Process tour categories response
            if (filterConfig.tourCategoryId) {
                const tourCategoriesResponse = responses[responseIndex++];
                if (tourCategoriesResponse?.success) {
                    setTourCategories(tourCategoriesResponse.data || []);
                }
            }
        } catch (error) {
            console.error('Error loading filter data:', error);
            message.error('Không thể tải dữ liệu bộ lọc');
        } finally {
            setLoading(false);
        }
    };

    // Handle form submission
    const handleSearch = () => {
        const formValues = form.getFieldsValue();

        const filter = {
            priceFrom: formValues.priceRange ? formValues.priceRange[0] : null,
            priceTo: formValues.priceRange ? formValues.priceRange[1] : null,
            ...(filterConfig.cityId && { cityId: formValues.cityId || null }),
            ...(filterConfig.departureCityId && { departureCityId: formValues.departureCityId || null }),
            ...(filterConfig.destinationCityId && { destinationCityId: formValues.destinationCityId || null }),
            ...(filterConfig.tourTypeId && { tourTypeId: formValues.tourTypeId || null }),
            ...(filterConfig.tourCategoryId && { tourCategoryId: formValues.tourCategoryId || null }),
            ...(filterConfig.departureDate && {
                departureDate: formValues.departureDate ? formValues.departureDate.format('YYYY-MM-DD') : null
            }),
            ...(filterConfig.starRating && { starRating: formValues.starRating || null }),
            ...(filterConfig.type && { type: formValues.type || null }),
            ...(filterConfig.vehicle && { vehicle: formValues.vehicle || null })
        };

        onFilterChange(filter);
    };

    // Handle reset filters
    const handleReset = () => {
        const defaultPriceRange = [0, 50000000];
        form.resetFields();
        setPriceRange(defaultPriceRange);
        form.setFieldsValue({ priceRange: defaultPriceRange });

        const emptyFilter = {
            priceFrom: null,
            priceTo: null,
            cityId: null,
            departureCityId: null,
            destinationCityId: null,
            tourTypeId: null,
            tourCategoryId: null,
            departureDate: null,
            starRating: null,
            type: null,
            vehicle: null
        };

        onFilterChange(emptyFilter);
    };

    // Format price display using utility
    const formatPrice = (value) => {
        return Utility.formatPrice(value);
    };

    // Get title based on type
    const getTitle = () => {
        switch (type) {
            case 'accommodation':
                return 'Bộ lọc tìm khách sạn';
            case 'tour':
                return 'Bộ lọc tìm tour';
            case 'combo':
                return 'Bộ lọc tìm combo';
            default:
                return 'Bộ lọc tìm kiếm';
        }
    };

    // Load data on component mount
    useEffect(() => {
        loadData();
    }, [type]);

    // Set initial form values
    useEffect(() => {
        if (initialFilters) {
            const priceRangeValue =
                initialFilters.priceFrom || initialFilters.priceTo
                    ? [initialFilters.priceFrom || 0, initialFilters.priceTo || 50000000]
                    : [0, 50000000];

            const formValues = {
                cityId: initialFilters.cityId,
                departureCityId: initialFilters.departureCityId,
                destinationCityId: initialFilters.destinationCityId,
                tourTypeId: initialFilters.tourTypeId,
                tourCategoryId: initialFilters.tourCategoryId,
                starRating: initialFilters.starRating,
                type: initialFilters.type ? parseInt(initialFilters.type, 10) : null,
                vehicle: initialFilters.vehicle,
                priceRange: priceRangeValue,
                departureDate: initialFilters.departureDate ? dayjs(initialFilters.departureDate) : null
            };

            form.setFieldsValue(formValues);
            setPriceRange(priceRangeValue);
        } else {
            // Set default values when no initial filters
            const defaultPriceRange = [0, 50000000];
            setPriceRange(defaultPriceRange);
            form.setFieldsValue({ priceRange: defaultPriceRange });
        }
    }, [initialFilters, form, cities, tourTypes, tourCategories]);

    return (
        <Card title={getTitle()} style={{ position: 'sticky', top: '24px', marginTop: '48px' }} loading={loading}>
            <Form form={form} layout="vertical" onFinish={handleSearch}>
                {/* Price Range - Always show */}
                <Form.Item name="priceRange" label="Ngân sách">
                    <div>
                        <Slider
                            range
                            min={0}
                            max={50000000}
                            step={500000}
                            value={priceRange}
                            onChange={(value) => {
                                setPriceRange(value);
                                form.setFieldsValue({ priceRange: value });
                            }}
                            tooltip={{ formatter: formatPrice }}
                            marks={{
                                0: '0đ',
                                10000000: '10M',
                                25000000: '25M',
                                50000000: '50M'
                            }}
                        />
                        <div style={{ marginTop: 8, textAlign: 'center', fontSize: '12px', color: '#666' }}>
                            {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                        </div>
                    </div>
                </Form.Item>

                {/* Accommodation specific fields */}
                {type === 'accommodation' && (
                    <>
                        {/* City */}
                        <Form.Item name="cityId" label="Thành phố">
                            <Select
                                placeholder="Chọn thành phố"
                                allowClear
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {cities.map((city) => (
                                    <Option key={city.id} value={city.id}>
                                        {city.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        {/* Star Rating */}
                        <Form.Item name="starRating" label="Hạng sao">
                            <Select placeholder="Chọn hạng sao" allowClear>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Option key={star} value={star}>
                                        {Array.from({ length: star }, (_, i) => (
                                            <StarFilled key={i} style={{ color: '#fadb14' }} />
                                        ))}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        {/* Accommodation Type */}
                        <Form.Item name="type" label="Loại hình lưu trú">
                            <Select placeholder="Chọn loại hình lưu trú" allowClear>
                                {Constants.AccommodationTypeOptions.map((option) => (
                                    <Option key={option.value} value={option.value}>
                                        {option.label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </>
                )}

                {/* Tour and Combo shared fields */}
                {(type === 'tour' || type === 'combo') && (
                    <>
                        {/* Departure City */}
                        <Form.Item name="departureCityId" label="Điểm khởi hành">
                            <Select
                                placeholder="Chọn điểm khởi hành"
                                allowClear
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {cities.map((city) => (
                                    <Option key={city.id} value={city.id}>
                                        {city.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        {/* Destination City */}
                        <Form.Item name="destinationCityId" label="Điểm tham quan">
                            <Select
                                placeholder="Chọn điểm tham quan"
                                allowClear
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {cities.map((city) => (
                                    <Option key={city.id} value={city.id}>
                                        {city.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        {/* Departure Date */}
                        <Form.Item name="departureDate" label="Ngày khởi hành">
                            <DatePicker
                                placeholder="Chọn ngày khởi hành"
                                style={{ width: '100%' }}
                                format="DD/MM/YYYY"
                                disabledDate={(current) => {
                                    return current && current.isBefore(dayjs(), 'day');
                                }}
                            />
                        </Form.Item>
                    </>
                )}

                {/* Tour specific fields */}
                {type === 'tour' && (
                    <>
                        {/* Tour Type */}
                        <Form.Item name="tourTypeId" label="Loại Tour">
                            <Select
                                placeholder="Chọn loại tour"
                                allowClear
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {tourTypes.map((type) => (
                                    <Option key={type.id} value={type.id}>
                                        {type.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        {/* Tour Category */}
                        <Form.Item name="tourCategoryId" label="Danh mục Tour">
                            <Select
                                placeholder="Chọn danh mục tour"
                                allowClear
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {tourCategories.map((category) => (
                                    <Option key={category.id} value={category.id}>
                                        {category.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </>
                )}

                {/* Combo specific fields */}
                {type === 'combo' && (
                    <Form.Item name="vehicle" label="Phương tiện">
                        <Select placeholder="Chọn phương tiện" allowClear>
                            {Constants.VehicleTypeOptions.map((option) => (
                                <Option key={option.value} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                )}

                {/* Action buttons */}
                <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />} block style={{ marginBottom: 8 }}>
                        Tìm kiếm
                    </Button>
                    <Button block onClick={handleReset}>
                        Xóa bộ lọc
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default ItemFilter;
