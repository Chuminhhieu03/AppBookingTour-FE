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
    Spin
} from 'antd';
import { PlusOutlined, MinusCircleOutlined, ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import TiptapEditor from 'components/TiptapEditor/TiptapEditor';
import comboAPI from 'api/combo/comboAPI';
import cityAPI from 'api/city/cityAPI';
import dayjs from 'dayjs';
import { VEHICLE_OPTIONS, STATUS_OPTIONS } from '../../constant/comboEnum';

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
        schedules: '4'
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
            const response = await cityAPI.getAllCities();
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
                            basePriceChildren: schedule.basePriceChildren
                        })) || []
                };

                form.setFieldsValue(formValues);
                setDescription(combo.description || '');

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
                navigate('/admin/combos');
            }
        } catch (error) {
            console.error('Error fetching combo:', error);
            message.error('Đã xảy ra lỗi khi tải thông tin combo');
            navigate('/admin/combos');
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
                schedules:
                    values.schedules?.map((schedule) => ({
                        id: schedule.id || null,
                        departureDate: schedule.departureDate.toISOString(),
                        returnDate: schedule.returnDate.toISOString(),
                        availableSlots: schedule.availableSlots,
                        basePriceAdult: schedule.basePriceAdult || values.basePriceAdult,
                        basePriceChildren: schedule.basePriceChildren || values.basePriceChildren
                    })) || []
            };

            const response = await comboAPI.update(id, data);

            if (response.success) {
                // ⭐ XỬ LÝ XÓA ẢNH CŨ TRƯỚC
                // 1. Xóa ảnh bìa cũ nếu user đã xóa
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
                navigate('/admin/combos');
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
                                {VEHICLE_OPTIONS.map((option) => (
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
                                {STATUS_OPTIONS.map((option) => (
                                    <Radio.Button key={option.value} value={option.value === 'active'}>
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
                        <Button onClick={() => navigate('/admin/combos')} icon={<ArrowLeftOutlined />} size="large">
                            Hủy
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </MainCard>
    );
};

export default CombosEdit;
