import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams, Link } from 'react-router-dom';
import { Result, Button, Spin } from 'antd';
import { confirmEmailAsync } from '../../../features/auth/authSlice';

export default function ConfirmEmailPage() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const userName = searchParams.get('userName');
  const token = searchParams.get('token');

  useEffect(() => {
    const confirmEmail = async () => {
      if (!userName || !token) {
        setError('Link xác minh không hợp lệ');
        setLoading(false);
        return;
      }

      try {
        await dispatch(confirmEmailAsync({ userName, token })).unwrap();
        setSuccess(true);
      } catch (err) {
        setError(err || 'Có lỗi xảy ra khi xác minh email');
      } finally {
        setLoading(false);
      }
    };

    confirmEmail();
  }, [dispatch, userName, token]);

  if (loading) {
    return (
      <div className="auth-main">
        <div className="auth-wrapper v1">
          <div className="auth-form">
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
              <Spin size="large" />
              <p style={{ marginTop: 20 }}>Đang xác minh email...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="auth-main">
        <div className="auth-wrapper v1">
          <div className="auth-form">
            <Result
              status="error"
              title="Xác minh thất bại"
              subTitle={error}
              extra={[
                <Link to="/register" key="register">
                  <Button type="primary" size="large">
                    Đăng ký lại
                  </Button>
                </Link>,
                <Link to="/login" key="login">
                  <Button size="large">Đăng nhập</Button>
                </Link>
              ]}
            />
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="auth-main">
        <div className="auth-wrapper v1">
          <div className="auth-form">
            <Result
              status="success"
              title="Xác minh email thành công!"
              subTitle="Tài khoản của bạn đã được kích hoạt. Bạn có thể đăng nhập ngay bây giờ."
              extra={[
                <Link to="/login" key="login">
                  <Button type="primary" size="large">
                    Đăng nhập ngay
                  </Button>
                </Link>
              ]}
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
}
