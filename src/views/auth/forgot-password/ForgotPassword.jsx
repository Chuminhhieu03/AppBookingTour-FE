import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Typography, Card, Result } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { forgotPasswordAsync } from '../../../features/auth/authSlice';
import { useState } from 'react';
import DarkLogo from 'assets/images/logo-dark.svg';

const { Title, Text } = Typography;

export default function ForgotPasswordPage() {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);
    const [success, setSuccess] = useState(false);
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            await dispatch(forgotPasswordAsync(values.email)).unwrap();
            setSuccess(true);
        } catch (error) {
            console.error('Forgot password failed:', error);
        }
    };

    if (success) {
        return (
            <div className="auth-main">
                <div className="auth-wrapper v1">
                    <div className="auth-form">
                        <Result
                            status="success"
                            title="Email đã được gửi!"
                            subTitle="Vui lòng kiểm tra hộp thư email của bạn để nhận hướng dẫn đặt lại mật khẩu."
                            extra={[
                                <Link to="/login" key="login">
                                    <Button type="primary" size="large">
                                        Quay về đăng nhập
                                    </Button>
                                </Link>
                            ]}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-main">
            <div className="auth-wrapper v1">
                <div className="auth-form">
                    <Card style={{ maxWidth: 450, width: '100%', margin: '0 auto', borderRadius: 8 }}>
                        <div style={{ textAlign: 'center', marginBottom: 24 }}>
                            <img src={DarkLogo} alt="Logo" style={{ height: 40, marginBottom: 16 }} />
                            <Title level={3} style={{ marginBottom: 8 }}>
                                Quên mật khẩu?
                            </Title>
                            <Text type="secondary">Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu</Text>
                        </div>

                        <Form form={form} name="forgot-password" onFinish={onFinish} layout="vertical" autoComplete="off">
                            <Form.Item
                                name="email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email!' },
                                    { type: 'email', message: 'Email không hợp lệ!' }
                                ]}
                            >
                                <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" size="large" loading={loading} block>
                                    Gửi email
                                </Button>
                            </Form.Item>

                            <div style={{ textAlign: 'center' }}>
                                <Link to="/login" style={{ color: '#1890ff' }}>
                                    ← Quay về đăng nhập
                                </Link>
                            </div>
                        </Form>
                    </Card>
                </div>
            </div>
        </div>
    );
}
