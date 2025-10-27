import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, Typography, Card } from 'antd';
import { LockOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { changePasswordAsync } from '../../../features/auth/authSlice';
import MainCard from 'components/MainCard';

const { Title } = Typography;

export default function ChangePasswordPage() {
    const dispatch = useDispatch();
    const { loading, user } = useSelector((state) => state.auth);
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            await dispatch(
                changePasswordAsync({
                    email: user.email,
                    currentPassword: values.currentPassword,
                    newPassword: values.newPassword,
                    confirmPassword: values.confirmPassword
                })
            ).unwrap();
            form.resetFields();
        } catch (error) {
            console.error('Change password failed:', error);
        }
    };

    return (
        <MainCard title="Đổi mật khẩu">
            <Card bordered={false} style={{ maxWidth: 600 }}>
                <Title level={4} style={{ marginBottom: 24 }}>
                    Thay đổi mật khẩu của bạn
                </Title>

                <Form form={form} name="change-password" onFinish={onFinish} layout="vertical" autoComplete="off">
                    <Form.Item
                        name="currentPassword"
                        label="Mật khẩu hiện tại"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Mật khẩu hiện tại"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>

                    <Form.Item
                        name="newPassword"
                        label="Mật khẩu mới"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Mật khẩu mới"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Xác nhận mật khẩu mới"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu không khớp!'));
                                }
                            })
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Xác nhận mật khẩu mới"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Đổi mật khẩu
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </MainCard>
    );
}
