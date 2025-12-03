import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Form,
    Input,
    InputNumber,
    Select,
    Button,
    Space,
    Card,
    Row,
    Col,
    Typography,
    message,
    Tabs,
    Radio,
    Upload,
    DatePicker,
    Divider,
    Spin,
    Alert
} from 'antd';
import {
    PlusOutlined,
    MinusCircleOutlined,
    ArrowLeftOutlined,
    SaveOutlined,
    EnvironmentOutlined,
    CoffeeOutlined,
    TeamOutlined,
    ClockCircleOutlined,
    CarOutlined,
    GiftOutlined,
    HomeOutlined,
    ShopOutlined,
    StarOutlined,
    HeartOutlined,
    PhoneOutlined,
    SafetyOutlined,
    ThunderboltOutlined,
    TrophyOutlined,
    RocketOutlined,
    SmileOutlined,
    CustomerServiceOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import MainCard from 'components/MainCard';
import TiptapEditor from 'components/TiptapEditor/TiptapEditor';
import comboAPI from 'api/combo/comboAPI';
import cityAPI from 'api/city/cityAPI';
import dayjs from 'dayjs';
import Constants from 'Constants/Constants';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const CombosEdit = () => {
    const { id } = useParams(); // ⭐ KHÁC BIỆT: Lấy ID từ URL params
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true); // ⭐ KHÁC BIỆT: Thêm loading khi fetch data
    const [cities, setCities] = useState([]);
    const [loadingCities, setLoadingCities] = useState(true);
    const [description, setDescription] = useState('');
    const [coverFileList, setCoverFileList] = useState([]);
    const [galleryFileList, setGalleryFileList] = useState([]);
    const [activeTab, setActiveTab] = useState('1');

    // ⭐ THÊM STATE ĐỂ TRACK ẢNH BỊ XÓA
    const [deletedCoverImage, setDeletedCoverImage] = useState(false);
    const [deletedGalleryImages, setDeletedGalleryImages] = useState([]);
    const [originalCoverUrl, setOriginalCoverUrl] = useState(null);
    const [originalGalleryUrls, setOriginalGalleryUrls] = useState([]);
    const [additionalInfoItems, setAdditionalInfoItems] = useState([
        { icon: 'EnvironmentOutlined', title: 'Điểm tham quan', content: '', color: '#04a9f5' },
        { icon: 'CoffeeOutlined', title: 'Ẩm thực', content: '', color: '#fd7e14' },
        { icon: 'TeamOutlined', title: 'Đối tượng thích hợp', content: '', color: '#52c41a' },
        { icon: 'ClockCircleOutlined', title: 'Thời gian lý tưởng', content: '', color: '#9c27b0' },
        { icon: 'CarOutlined', title: 'Phương tiện', content: '', color: '#ff9800' },
        { icon: 'GiftOutlined', title: 'Khuyến mãi', content: '', color: '#e91e63' }
    ]);

    const [importantInfoSections, setImportantInfoSections] = useState([
        {
            title: 'Điều kiện thanh toán',
            items: [
                'Đặt cọc 30% giá tour khi đăng ký',
                'Thanh toán 70% còn lại trước 7 ngày khởi hành',
                'Thanh toán qua chuyển khoản hoặc tiền mặt'
            ]
        },
        {
            title: 'Điều kiện hủy tour',
            items: [
                'Hủy trước 15 ngày: Hoàn lại 70% tiền cọc',
                'Hủy trước 7-14 ngày: Hoàn lại 50% tiền cọc',
                'Hủy trước 3-6 ngày: Hoàn lại 30% tiền cọc',
                'Hủy trong vòng 2 ngày: Không hoàn tiền'
            ]
        },
        {
            title: 'Giấy tờ cần mang theo',
            items: [
                'CMND/CCCD hoặc hộ chiếu còn hạn',
                'Giấy khai sinh (đối với trẻ em dưới 14 tuổi)',
                'Sổ hộ khẩu (nếu có yêu cầu)',
                'Vé máy bay và voucher khách sạn (công ty sẽ cung cấp)'
            ]
        },
        {
            title: 'Hành lý',
            items: [
                'Hành lý xách tay: Tối đa 7kg',
                'Hành lý ký gửi: Tối đa 20kg (tùy hãng bay)',
                'Mang theo thuốc cá nhân, đồ dùng cá nhân',
                'Quần áo phù hợp với thời tiết điểm đến'
            ]
        },
        {
            title: 'Lưu ý quan trọng',
            items: [
                'Vui lòng có mặt trước giờ khởi hành 30 phút',
                'Giữ gìn vệ sinh chung, không xả rác bừa bãi',
                'Không mang theo các vật dụng cấm theo quy định',
                'Tuân thủ nội quy, hướng dẫn của HDV'
            ]
        },
        {
            title: 'Chính sách trẻ em',
            items: [
                'Trẻ em dưới 2 tuổi: 10% giá tour (không ghế ngồi riêng)',
                'Trẻ em từ 2-5 tuổi: 50% giá tour (ngủ chung giường người lớn)',
                'Trẻ em từ 6-11 tuổi: 75% giá tour (có ghế ngồi riêng)',
                'Trẻ em từ 12 tuổi trở lên: 100% giá tour như người lớn'
            ]
        }
    ]);

    const iconOptions = [
        { value: 'EnvironmentOutlined', label: 'Điểm tham quan', icon: <EnvironmentOutlined /> },
        { value: 'CoffeeOutlined', label: 'Ẩm thực', icon: <CoffeeOutlined /> },
        { value: 'TeamOutlined', label: 'Nhóm người', icon: <TeamOutlined /> },
        { value: 'ClockCircleOutlined', label: 'Thời gian', icon: <ClockCircleOutlined /> },
        { value: 'CarOutlined', label: 'Phương tiện', icon: <CarOutlined /> },
        { value: 'GiftOutlined', label: 'Khuyến mãi', icon: <GiftOutlined /> },
        { value: 'HomeOutlined', label: 'Khách sạn', icon: <HomeOutlined /> },
        { value: 'ShopOutlined', label: 'Mua sắm', icon: <ShopOutlined /> },
        { value: 'StarOutlined', label: 'Đánh giá', icon: <StarOutlined /> },
        { value: 'HeartOutlined', label: 'Yêu thích', icon: <HeartOutlined /> },
        { value: 'PhoneOutlined', label: 'Liên hệ', icon: <PhoneOutlined /> },
        { value: 'SafetyOutlined', label: 'An toàn', icon: <SafetyOutlined /> },
        { value: 'ThunderboltOutlined', label: 'Nhanh chóng', icon: <ThunderboltOutlined /> },
        { value: 'TrophyOutlined', label: 'Giải thưởng', icon: <TrophyOutlined /> },
        { value: 'RocketOutlined', label: 'Khám phá', icon: <RocketOutlined /> },
        { value: 'SmileOutlined', label: 'Hài lòng', icon: <SmileOutlined /> },
        { value: 'CustomerServiceOutlined', label: 'Hỗ trợ', icon: <CustomerServiceOutlined /> }
    ];

    // TẠO MAP FIELD VỚI TAB KEY
    const fieldToTabMap = {
        code: '1',
        name: '1',
        fromCityId: '1',
        toCityId: '1',
        vehicle: '1',
        durationDays: '1',
        shortDescription: '1',
        isActive: '1',
        basePriceAdult: '2',
        basePriceChildren: '2',
        amenities: '3',
        includes: '3',
        excludes: '3',
        termsConditions: '3',
        schedules: '4',
        additionalInfo: '5',
        importantInfo: '6'
    };

    // ⭐ KHÁC BIỆT: Fetch cities VÀ combo data khi component mount
    useEffect(() => {
        const loadData = async () => {
            await fetchCities();
            await fetchComboData();
        };
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);
    const fetchCities = async () => {
        try {
            setLoadingCities(true);
            const response = await cityAPI.getListCity();
            if (response.success) {
                setCities(response.data || []);
            } else {
                message.error('Không thể tải danh sách thành phố');
                setCities([]);
            }
        } catch (error) {
            console.error('Error fetching cities:', error);
            message.error('Đã xảy ra lỗi khi tải danh sách thành phố');
            setCities([]);
        } finally {
            setLoadingCities(false);
        }
    };

    const fetchComboData = async () => {
        setLoadingData(true);
        try {
            const response = await comboAPI.getById(id);
            if (response.success) {
                const combo = response.data;

                // Convert vehicle từ string sang number
                let vehicleValue = 1;
                if (combo.vehicle === 'Car') vehicleValue = 1;
                else if (combo.vehicle === 'Plane') vehicleValue = 2;
                else vehicleValue = combo.vehicle;

                // Convert data to form values
                const formValues = {
                    code: combo.code,
                    name: combo.name,
                    fromCityId: combo.fromCityId,
                    toCityId: combo.toCityId,
                    vehicle: vehicleValue,
                    durationDays: combo.durationDays,
                    shortDescription: combo.shortDescription || '',
                    basePriceAdult: combo.basePriceAdult,
                    basePriceChildren: combo.basePriceChildren,
                    // Convert array to string với \n
                    amenities: Array.isArray(combo.amenities) ? combo.amenities.join('\n') : combo.amenities || '',
                    includes: Array.isArray(combo.includes) ? combo.includes.join('\n') : combo.includes || '',
                    excludes: Array.isArray(combo.excludes) ? combo.excludes.join('\n') : combo.excludes || '',
                    termsConditions: combo.termsConditions || '',
                    isActive: combo.isActive,
                    schedules:
                        combo.schedules?.map((schedule) => ({
                            id: schedule.id,
                            departureDate: schedule.departureDate ? dayjs(schedule.departureDate) : null,
                            returnDate: schedule.returnDate ? dayjs(schedule.returnDate) : null,
                            availableSlots: schedule.availableSlots,
                            basePriceAdult: schedule.basePriceAdult,
                            basePriceChildren: schedule.basePriceChildren,
                            singleRoomSupplement: schedule.singleRoomSupplement
                        })) || []
                };

                form.setFieldsValue(formValues);
                setDescription(combo.description || '');

                // Parse additionalInfo
                if (combo.additionalInfo) {
                    try {
                        const parsed = JSON.parse(combo.additionalInfo);
                        if (parsed.items && Array.isArray(parsed.items)) {
                            setAdditionalInfoItems(parsed.items);
                        }
                    } catch (error) {
                        console.error('Failed to parse additionalInfo:', error);
                    }
                }

                // Parse importantInfo
                if (combo.importantInfo) {
                    try {
                        const parsed = JSON.parse(combo.importantInfo);
                        if (parsed && Array.isArray(parsed.sections)) {
                            setImportantInfoSections(parsed.sections);
                        }
                    } catch (e) {
                        console.error('Failed to parse importantInfo:', e);
                    }
                }

                // ⭐ Sử dụng comboImageCoverUrl (thay vì comboImageCover)
                if (combo.comboImageCoverUrl) {
                    setOriginalCoverUrl(combo.comboImageCoverUrl); // ⭐ Lưu URL gốc
                    setCoverFileList([
                        {
                            uid: '-1',
                            name: 'cover.jpg',
                            status: 'done',
                            url: combo.comboImageCoverUrl
                        }
                    ]);
                }

                if (combo.comboImages && combo.comboImages.length > 0) {
                    setOriginalGalleryUrls(combo.comboImages); // ⭐ Lưu URL gốc
                    setGalleryFileList(
                        combo.comboImages.map((url, index) => ({
                            uid: `-${index + 2}`,
                            name: `gallery-${index + 1}.jpg`,
                            status: 'done',
                            url
                        }))
                    );
                }
            } else {
                message.error('Không thể tải thông tin combo');
                navigate('/admin/service/combo');
            }
        } catch (error) {
            console.error('Error fetching combo:', error);
            message.error('Đã xảy ra lỗi khi tải thông tin combo');
            navigate('/admin/service/combo');
        } finally {
            setLoadingData(false);
        }
    };

    const beforeUpload = (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('Chỉ được tải lên file ảnh!');
            return Upload.LIST_IGNORE;
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Ảnh phải nhỏ hơn 5MB!');
            return Upload.LIST_IGNORE;
        }
        return false; // Prevent auto upload
    };

    const handleCoverChange = ({ fileList: newFileList }) => {
        setCoverFileList(newFileList.slice(-1)); // Keep only last file

        // ⭐ Kiểm tra nếu user xóa ảnh bìa cũ
        if (newFileList.length === 0 && originalCoverUrl) {
            setDeletedCoverImage(true);
        } else if (newFileList.length > 0) {
            setDeletedCoverImage(false);
        }
    };

    const handleGalleryChange = ({ fileList: newFileList }) => {
        setGalleryFileList(newFileList.slice(-10)); // Keep max 10 files

        // ⭐ Tìm các ảnh cũ đã bị xóa
        const currentUrls = newFileList.map((file) => file.url).filter(Boolean);
        const deletedUrls = originalGalleryUrls.filter((url) => !currentUrls.includes(url));
        setDeletedGalleryImages(deletedUrls);
    };

    const handleFinishFailed = (errorInfo) => {
        if (errorInfo.errorFields && errorInfo.errorFields.length > 0) {
            const firstErrorField = errorInfo.errorFields[0];
            const firstErrorNamePath = firstErrorField.name;
            const topLevelFieldName = Array.isArray(firstErrorNamePath) ? firstErrorNamePath[0] : firstErrorNamePath;

            const firstErrorMessage = firstErrorField.errors[0];
            message.error(firstErrorMessage || 'Vui lòng kiểm tra lại các trường bị lỗi');

            const targetTab = fieldToTabMap[topLevelFieldName];

            if (targetTab) {
                if (targetTab !== activeTab) {
                    setActiveTab(targetTab);
                }

                setTimeout(() => {
                    form.scrollToField(firstErrorNamePath, {
                        behavior: 'smooth',
                        block: 'center',
                        focus: true
                    });
                }, 100);
            }
        }
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            // Serialize additionalInfo to JSON string
            let additionalInfoJson = null;
            if (additionalInfoItems.length > 0) {
                const validItems = additionalInfoItems.filter((item) => item.title && item.content);
                if (validItems.length > 0) {
                    additionalInfoJson = JSON.stringify({ items: validItems });
                }
            }

            // Serialize importantInfo to JSON string
            let importantInfoJson = null;
            const validSections = importantInfoSections.filter((section) => section.title && section.items && section.items.length > 0);
            if (validSections.length > 0) {
                importantInfoJson = JSON.stringify({ sections: validSections });
            }

            // Prepare data theo API format (giống Addnew)
            const data = {
                code: values.code,
                name: values.name,
                fromCityId: values.fromCityId,
                toCityId: values.toCityId,
                shortDescription: values.shortDescription || '',
                vehicle: values.vehicle,
                comboImageCover: null,
                comboImages: null,
                durationDays: values.durationDays,
                basePriceAdult: values.basePriceAdult,
                basePriceChildren: values.basePriceChildren,
                amenities: values.amenities || '',
                description: description || '',
                includes: values.includes || '',
                excludes: values.excludes || '',
                termsConditions: values.termsConditions || '',
                isActive: values.isActive !== undefined ? values.isActive : true,
                additionalInfo: additionalInfoJson,
                importantInfo: importantInfoJson,
                schedules:
                    values.schedules?.map((schedule) => ({
                        id: schedule.id || null,
                        departureDate: schedule.departureDate.add(7, 'hour').toISOString(),
                        returnDate: schedule.returnDate.add(7, 'hour').toISOString(),
                        availableSlots: schedule.availableSlots,
                        basePriceAdult: schedule.basePriceAdult || values.basePriceAdult,
                        basePriceChildren: schedule.basePriceChildren || values.basePriceChildren,
                        singleRoomSupplement: schedule.singleRoomSupplement || 0
                    })) || []
            };

            const response = await comboAPI.update(id, data);

            if (response.success) {
                if (deletedCoverImage && originalCoverUrl) {
                    try {
                        await comboAPI.deleteCoverImage(id);
                    } catch (error) {
                        console.error('Error deleting cover image:', error);
                    }
                }

                // 2. Xóa các ảnh gallery cũ nếu user đã xóa
                if (deletedGalleryImages.length > 0) {
                    try {
                        await comboAPI.deleteGalleryImages(id, deletedGalleryImages);
                    } catch (error) {
                        console.error('Error deleting gallery images:', error);
                    }
                }

                // ⭐ UPLOAD ẢNH MỚI (chỉ upload file mới, không phải URL cũ)
                const newCoverFiles = coverFileList.filter((file) => file.originFileObj);
                const newGalleryFiles = galleryFileList.filter((file) => file.originFileObj);

                if (newCoverFiles.length > 0 || newGalleryFiles.length > 0) {
                    try {
                        const formData = new FormData();
                        if (newCoverFiles.length > 0) {
                            formData.append('coverImage', newCoverFiles[0].originFileObj);
                        }
                        newGalleryFiles.forEach((file) => {
                            formData.append('images', file.originFileObj);
                        });

                        await comboAPI.uploadImages(id, formData);
                    } catch (uploadError) {
                        console.error('Error uploading images:', uploadError);
                        message.warning('Cập nhật combo thành công nhưng upload ảnh thất bại');
                    }
                }

                message.success('Cập nhật combo thành công');
                navigate('/admin/service/combo');
            } else {
                message.error(response.message || 'Không thể cập nhật combo');
            }
        } catch (error) {
            console.error('Có lỗi khi cập nhật combo:', error);
            const errorMsg = error.response?.data?.message || 'Đã xảy ra lỗi khi cập nhật combo';
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <MainCard>
                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                    <Spin size="large" tip="Đang tải thông tin combo..." />
                </div>
            </MainCard>
        );
    }

    const tabItems = [
        {
            key: '1',
            label: 'Thông tin cơ bản',
            children: (
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Mã Combo"
                            name="code"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mã combo' },
                                { max: 50, message: 'Mã combo không được quá 50 ký tự' },
                                { pattern: /^[A-Z0-9-]+$/, message: 'Mã combo chỉ được chứa chữ hoa, số và dấu gạch ngang' }
                            ]}
                        >
                            <Input placeholder="VD: HN-HL-3N2D-001" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Tên Combo"
                            name="name"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên combo' },
                                { max: 200, message: 'Tên combo không được quá 200 ký tự' }
                            ]}
                        >
                            <Input placeholder="Du lịch Hạ Long 3 ngày 2 đêm" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Thành phố đi"
                            name="fromCityId"
                            rules={[{ required: true, message: 'Vui lòng chọn thành phố xuất phát' }]}
                        >
                            <Select
                                placeholder="Chọn thành phố đi"
                                showSearch
                                loading={loadingCities}
                                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                            >
                                {cities.map((city) => (
                                    <Option key={city.id} value={city.id}>
                                        {city.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Thành phố đến"
                            name="toCityId"
                            dependencies={['fromCityId']}
                            rules={[
                                { required: true, message: 'Vui lòng chọn thành phố đến' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('fromCityId') !== value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Thành phố đến phải khác thành phố đi'));
                                    }
                                })
                            ]}
                        >
                            <Select
                                placeholder="Chọn thành phố đến"
                                showSearch
                                loading={loadingCities}
                                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                            >
                                {cities.map((city) => (
                                    <Option key={city.id} value={city.id}>
                                        {city.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item label="Phương tiện" name="vehicle" rules={[{ required: true, message: 'Vui lòng chọn phương tiện' }]}>
                            <Radio.Group>
                                {Constants.VehicleTypeOptions.map((option) => (
                                    <Radio.Button key={option.value} value={option.value}>
                                        {option.label}
                                    </Radio.Button>
                                ))}
                            </Radio.Group>
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item label="Số ngày" name="durationDays" rules={[{ required: true, message: 'Vui lòng nhập số ngày' }]}>
                            <InputNumber min={1} max={30} style={{ width: '100%' }} placeholder="3" addonAfter="ngày" />
                        </Form.Item>
                    </Col>

                    <Col xs={24}>
                        <Form.Item
                            label="Mô tả ngắn"
                            name="shortDescription"
                            rules={[{ max: 500, message: 'Mô tả ngắn không được quá 500 ký tự' }]}
                        >
                            <TextArea rows={3} placeholder="Mô tả ngắn gọn về combo tour..." maxLength={500} showCount />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item label="Trạng thái" name="isActive" initialValue={true}>
                            <Radio.Group>
                                {Constants.StatusOptions.map((option) => (
                                    <Radio.Button key={option.value.toString()} value={option.value}>
                                        {option.label}
                                    </Radio.Button>
                                ))}
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                </Row>
            ),
            forceRender: true
        },
        {
            key: '2',
            label: 'Giá & Hình ảnh',
            children: (
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Giá cơ bản người lớn"
                            name="basePriceAdult"
                            rules={[{ required: true, message: 'Vui lòng nhập giá cơ bản người lớn' }]}
                        >
                            <InputNumber
                                min={0}
                                max={100000000}
                                style={{ width: '100%' }}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                placeholder="4,500,000"
                                addonAfter="VNĐ"
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Giá trẻ em"
                            name="basePriceChildren"
                            dependencies={['basePriceAdult']}
                            rules={[
                                { required: true, message: 'Vui lòng nhập giá cơ bản trẻ em' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('basePriceAdult') >= value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Giá cơ bản trẻ em không được cao hơn giá người lớn'));
                                    }
                                })
                            ]}
                        >
                            <InputNumber
                                min={0}
                                style={{ width: '100%' }}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                placeholder="3,000,000"
                                addonAfter="VNĐ"
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item label="Ảnh bìa" extra="Chỉ được upload 1 ảnh, tối đa 5MB">
                            <Upload
                                fileList={coverFileList}
                                onChange={handleCoverChange}
                                beforeUpload={beforeUpload}
                                listType="picture-card"
                                maxCount={1}
                            >
                                {coverFileList.length < 1 && (
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                )}
                            </Upload>
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item label="Thư viện ảnh" extra="Tối đa 10 ảnh, mỗi ảnh không quá 5MB">
                            <Upload
                                fileList={galleryFileList}
                                onChange={handleGalleryChange}
                                beforeUpload={beforeUpload}
                                listType="picture-card"
                                multiple
                                maxCount={10}
                            >
                                {galleryFileList.length < 10 && (
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                )}
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
            ),
            forceRender: true
        },
        {
            key: '3',
            label: 'Chi tiết tour',
            children: (
                <Row gutter={[16, 16]}>
                    <Col xs={24}>
                        <Form.Item label="Tiện nghi" name="amenities" extra="Mỗi tiện nghi trên một dòng">
                            <TextArea
                                rows={4}
                                placeholder={'WiFi miễn phí\nBữa sáng buffet\nXe đưa đón sân bay\nHướng dẫn viên tiếng Việt'}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24}>
                        <div style={{ marginBottom: 8 }}>
                            <strong>Mô tả chi tiết:</strong>
                        </div>
                        <div style={{ border: '1px solid #d9d9d9', borderRadius: 4 }}>
                            <TiptapEditor
                                content={description}
                                onChange={setDescription}
                                placeholder="Nhập mô tả chi tiết về combo tour..."
                                minHeight={300}
                            />
                        </div>
                    </Col>

                    <Col xs={24}>
                        <Form.Item label="Bao gồm" name="includes" extra="Mỗi mục trên một dòng">
                            <TextArea
                                rows={4}
                                placeholder={
                                    'Vé máy bay khứ hồi\nKhách sạn 4 sao\nBữa ăn theo chương trình\nVé tham quan các điểm\nBảo hiểm du lịch'
                                }
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24}>
                        <Form.Item label="Không bao gồm" name="excludes" extra="Mỗi mục trên một dòng">
                            <TextArea rows={4} placeholder={'Chi phí cá nhân\nĐồ uống có cồn\nTips cho hướng dẫn viên'} />
                        </Form.Item>
                    </Col>

                    <Col xs={24}>
                        <Form.Item label="Điều khoản & Điều kiện" name="termsConditions">
                            <TextArea
                                rows={4}
                                placeholder="- Giá tour có thể thay đổi tùy theo mùa cao điểm&#10;- Hủy tour trước 7 ngày được hoàn 50% tiền&#10;- Hủy tour trước 3 ngày mất 100% tiền"
                            />
                        </Form.Item>
                    </Col>
                </Row>
            ),
            forceRender: true
        },
        {
            key: '4',
            label: 'Lịch khởi hành',
            children: (
                <div>
                    <Form.List
                        name="schedules"
                        rules={[
                            {
                                validator: async (_, schedules) => {
                                    if (!schedules || schedules.length < 1) {
                                        return Promise.reject(new Error('Phải có ít nhất 1 lịch khởi hành'));
                                    }
                                }
                            }
                        ]}
                    >
                        {(fields, { add, remove }, { errors }) => (
                            <>
                                {fields.map((field, index) => (
                                    <Card
                                        key={field.key}
                                        size="small"
                                        title={`Lịch khởi hành ${index + 1}`}
                                        extra={
                                            fields.length > 1 ? (
                                                <MinusCircleOutlined onClick={() => remove(field.name)} style={{ color: 'red' }} />
                                            ) : null
                                        }
                                        style={{ marginBottom: 16 }}
                                    >
                                        <Row gutter={[16, 8]}>
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    {...field}
                                                    label="Ngày khởi hành"
                                                    name={[field.name, 'departureDate']}
                                                    rules={[
                                                        { required: true, message: 'Vui lòng chọn ngày khởi hành' },
                                                        {
                                                            validator: (_, value) => {
                                                                if (!value || dayjs(value).isAfter(dayjs())) {
                                                                    return Promise.resolve();
                                                                }
                                                                return Promise.reject(new Error('Ngày khởi hành phải sau hôm nay'));
                                                            }
                                                        }
                                                    ]}
                                                >
                                                    <DatePicker
                                                        format="DD/MM/YYYY"
                                                        style={{ width: '100%' }}
                                                        placeholder="Chọn ngày giờ khởi hành"
                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    {...field}
                                                    label="Ngày về"
                                                    name={[field.name, 'returnDate']}
                                                    dependencies={[['schedules', field.name, 'departureDate']]}
                                                    rules={[
                                                        { required: true, message: 'Vui lòng chọn ngày về' },
                                                        ({ getFieldValue }) => ({
                                                            validator(_, value) {
                                                                const departureDate = getFieldValue([
                                                                    'schedules',
                                                                    field.name,
                                                                    'departureDate'
                                                                ]);
                                                                if (
                                                                    !value ||
                                                                    !departureDate ||
                                                                    dayjs(value).isAfter(dayjs(departureDate))
                                                                ) {
                                                                    return Promise.resolve();
                                                                }
                                                                return Promise.reject(new Error('Ngày về phải sau ngày khởi hành'));
                                                            }
                                                        })
                                                    ]}
                                                >
                                                    <DatePicker
                                                        format="DD/MM/YYYY"
                                                        style={{ width: '100%' }}
                                                        placeholder="Chọn ngày giờ về"
                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24} md={8}>
                                                <Form.Item
                                                    {...field}
                                                    label="Số chỗ"
                                                    name={[field.name, 'availableSlots']}
                                                    rules={[{ required: true, message: 'Vui lòng nhập số chỗ' }]}
                                                >
                                                    <InputNumber min={1} max={500} style={{ width: '100%' }} placeholder="30" />
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24} md={8}>
                                                <Form.Item
                                                    {...field}
                                                    label="Giá người lớn (tùy chọn)"
                                                    name={[field.name, 'basePriceAdult']}
                                                    extra="Để trống = giá mặc định"
                                                >
                                                    <InputNumber
                                                        min={0}
                                                        style={{ width: '100%' }}
                                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                                        placeholder="Giá mặc định"
                                                        addonAfter="VNĐ"
                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24} md={8}>
                                                <Form.Item
                                                    {...field}
                                                    label="Giá trẻ em (tùy chọn)"
                                                    name={[field.name, 'basePriceChildren']}
                                                    extra="Để trống = giá mặc định"
                                                >
                                                    <InputNumber
                                                        min={0}
                                                        style={{ width: '100%' }}
                                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                                        placeholder="Giá mặc định"
                                                        addonAfter="VNĐ"
                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24} md={8}>
                                                <Form.Item
                                                    {...field}
                                                    label="Phụ phí phòng đơn (tùy chọn)"
                                                    name={[field.name, 'singleRoomSupplement']}
                                                    extra="Để trống = 0đ"
                                                >
                                                    <InputNumber
                                                        min={0}
                                                        style={{ width: '100%' }}
                                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                                        placeholder="0"
                                                        addonAfter="VNĐ"
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Card>
                                ))}

                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Thêm lịch khởi hành
                                    </Button>
                                    <Form.ErrorList errors={errors} />
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </div>
            ),
            forceRender: true
        },
        {
            key: '5',
            label: 'Thông tin chuyến đi',
            children: (
                <div>
                    <Alert
                        message="Quản lý thông tin hiển thị trên trang chi tiết combo"
                        description="Tối đa 10 items. Thông tin này sẽ hiển thị dưới dạng grid 3 cột cho khách hàng."
                        type="info"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />

                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        {additionalInfoItems.map((item, index) => (
                            <Card
                                key={index}
                                size="small"
                                title={`Item ${index + 1}`}
                                extra={
                                    additionalInfoItems.length > 1 && (
                                        <Button
                                            type="text"
                                            danger
                                            icon={<MinusCircleOutlined />}
                                            onClick={() => {
                                                setAdditionalInfoItems(additionalInfoItems.filter((_, i) => i !== index));
                                            }}
                                        >
                                            Xóa
                                        </Button>
                                    )
                                }
                            >
                                <Row gutter={16}>
                                    <Col xs={24} md={6}>
                                        <div style={{ marginBottom: 8 }}>
                                            <strong>Icon:</strong>
                                        </div>
                                        <Select
                                            value={item.icon}
                                            onChange={(value) => {
                                                const newItems = [...additionalInfoItems];
                                                newItems[index].icon = value;
                                                setAdditionalInfoItems(newItems);
                                            }}
                                            style={{ width: '100%' }}
                                        >
                                            {iconOptions.map((opt) => (
                                                <Select.Option key={opt.value} value={opt.value}>
                                                    <Space>
                                                        {opt.icon}
                                                        {opt.label}
                                                    </Space>
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Col>

                                    <Col xs={24} md={6}>
                                        <div style={{ marginBottom: 8 }}>
                                            <strong>Tiêu đề:</strong>
                                        </div>
                                        <Input
                                            value={item.title}
                                            onChange={(e) => {
                                                const newItems = [...additionalInfoItems];
                                                newItems[index].title = e.target.value;
                                                setAdditionalInfoItems(newItems);
                                            }}
                                            placeholder="VD: Điểm tham quan"
                                            maxLength={100}
                                        />
                                    </Col>

                                    <Col xs={24} md={9}>
                                        <div style={{ marginBottom: 8 }}>
                                            <strong>Nội dung:</strong>
                                        </div>
                                        <Input.TextArea
                                            value={item.content}
                                            onChange={(e) => {
                                                const newItems = [...additionalInfoItems];
                                                newItems[index].content = e.target.value;
                                                setAdditionalInfoItems(newItems);
                                            }}
                                            placeholder="VD: Sapa, Bản Cát Cát, Fansipan..."
                                            rows={2}
                                            maxLength={500}
                                            showCount
                                        />
                                    </Col>

                                    <Col xs={24} md={3}>
                                        <div style={{ marginBottom: 8 }}>
                                            <strong>Màu:</strong>
                                        </div>
                                        <Input
                                            type="color"
                                            value={item.color}
                                            onChange={(e) => {
                                                const newItems = [...additionalInfoItems];
                                                newItems[index].color = e.target.value;
                                                setAdditionalInfoItems(newItems);
                                            }}
                                            style={{ width: '100%', height: 40 }}
                                        />
                                    </Col>
                                </Row>
                            </Card>
                        ))}

                        {additionalInfoItems.length < 10 && (
                            <Button
                                type="dashed"
                                onClick={() => {
                                    setAdditionalInfoItems([
                                        ...additionalInfoItems,
                                        { icon: 'InfoCircleOutlined', title: '', content: '', color: '#04a9f5' }
                                    ]);
                                }}
                                block
                                icon={<PlusOutlined />}
                            >
                                Thêm thông tin
                            </Button>
                        )}
                    </Space>
                </div>
            ),
            forceRender: true
        },
        {
            key: '6',
            label: 'Thông tin quan trọng',
            children: (
                <div>
                    <Alert
                        message="Quản lý các thông tin quan trọng về tour"
                        description="Cấu hình các section như điều kiện thanh toán, hủy tour, giấy tờ cần thiết, hành lý, lưu ý và chính sách. Mỗi section có thể có nhiều items."
                        type="info"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />

                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                        {importantInfoSections.map((section, sectionIndex) => (
                            <Card
                                key={sectionIndex}
                                title={`Section ${sectionIndex + 1}`}
                                extra={
                                    <Button
                                        danger
                                        size="small"
                                        icon={<MinusCircleOutlined />}
                                        onClick={() => {
                                            if (importantInfoSections.length === 1) {
                                                message.warning('Phải có ít nhất 1 section!');
                                                return;
                                            }
                                            setImportantInfoSections((prev) => prev.filter((_, i) => i !== sectionIndex));
                                        }}
                                        disabled={importantInfoSections.length === 1}
                                    >
                                        Xóa section
                                    </Button>
                                }
                                style={{ border: '1px solid #d9d9d9' }}
                            >
                                <Row gutter={16}>
                                    <Col span={24} style={{ marginBottom: 16 }}>
                                        <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>
                                            Tiêu đề section <span style={{ color: 'red' }}>*</span>
                                        </label>
                                        <Input
                                            placeholder="VD: Điều kiện thanh toán, Hành lý, Chính sách trẻ em..."
                                            value={section.title}
                                            onChange={(e) => {
                                                const newSections = [...importantInfoSections];
                                                newSections[sectionIndex].title = e.target.value;
                                                setImportantInfoSections(newSections);
                                            }}
                                            maxLength={200}
                                            showCount
                                        />
                                    </Col>

                                    <Col span={24}>
                                        <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>
                                            Danh sách items <span style={{ color: 'red' }}>*</span>
                                        </label>
                                        <Space direction="vertical" style={{ width: '100%' }} size="small">
                                            {section.items.map((item, itemIndex) => (
                                                <Space.Compact key={itemIndex} style={{ width: '100%' }}>
                                                    <Input
                                                        placeholder="Nhập nội dung item..."
                                                        value={item}
                                                        onChange={(e) => {
                                                            const newSections = [...importantInfoSections];
                                                            newSections[sectionIndex].items[itemIndex] = e.target.value;
                                                            setImportantInfoSections(newSections);
                                                        }}
                                                        maxLength={500}
                                                        style={{ width: '100%' }}
                                                    />
                                                    <Button
                                                        danger
                                                        icon={<MinusCircleOutlined />}
                                                        onClick={() => {
                                                            if (section.items.length === 1) {
                                                                message.warning('Section phải có ít nhất 1 item!');
                                                                return;
                                                            }
                                                            const newSections = [...importantInfoSections];
                                                            newSections[sectionIndex].items = newSections[sectionIndex].items.filter(
                                                                (_, i) => i !== itemIndex
                                                            );
                                                            setImportantInfoSections(newSections);
                                                        }}
                                                        disabled={section.items.length === 1}
                                                    >
                                                        Xóa
                                                    </Button>
                                                </Space.Compact>
                                            ))}

                                            <Button
                                                type="dashed"
                                                icon={<PlusOutlined />}
                                                onClick={() => {
                                                    if (section.items.length >= 20) {
                                                        message.warning('Mỗi section tối đa 20 items!');
                                                        return;
                                                    }
                                                    const newSections = [...importantInfoSections];
                                                    newSections[sectionIndex].items.push('');
                                                    setImportantInfoSections(newSections);
                                                }}
                                                disabled={section.items.length >= 20}
                                                style={{ width: '100%' }}
                                            >
                                                Thêm item
                                            </Button>
                                        </Space>
                                    </Col>
                                </Row>
                            </Card>
                        ))}

                        <Button
                            type="dashed"
                            icon={<PlusOutlined />}
                            onClick={() => {
                                if (importantInfoSections.length >= 15) {
                                    message.warning('Tối đa 15 sections!');
                                    return;
                                }
                                setImportantInfoSections([...importantInfoSections, { title: '', items: [''] }]);
                            }}
                            disabled={importantInfoSections.length >= 15}
                            block
                            style={{ height: 48 }}
                        >
                            Thêm section mới
                        </Button>
                    </Space>
                </div>
            ),
            forceRender: true
        }
    ];

    return (
        <MainCard>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={3} style={{ margin: 0 }}>
                        Chỉnh sửa Combo Tour
                    </Title>
                </Col>
            </Row>

            <Form form={form} layout="vertical" onFinish={handleSubmit} onFinishFailed={handleFinishFailed} scrollToFirstError>
                <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} animated={false} />

                <Divider />

                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />} size="large">
                            Cập nhật Combo
                        </Button>
                        <Button onClick={() => navigate('/admin/service/combo')} icon={<ArrowLeftOutlined />} size="large">
                            Hủy
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </MainCard>
    );
};

export default CombosEdit;
