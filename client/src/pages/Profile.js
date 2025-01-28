import { useState, useEffect } from 'react';
import '../styles/Profile.css';
import Notification from '../components/Notification';

function Profile() {
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/users/profile', {
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setUser(data);
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.message,
      });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setNotification({
        type: 'error',
        message: 'Mật khẩu mới không khớp',
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        'http://localhost:8080/api/users/change-password',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setNotification({
        type: 'success',
        message: 'Cập nhật mật khẩu thành công',
      });

      // Reset form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsChangingPassword(false);
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.message,
      });
    }
  };

  return (
    <div className="profile">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="profile-container">
        <h1>Thông tin tài khoản</h1>

        {user && (
          <div className="profile-info">
            <div className="info-group">
              <label>Tên đăng nhập</label>
              <p>{user.username}</p>
            </div>
            <div className="info-group">
              <label>Vai trò</label>
              <p>{user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}</p>
            </div>
          </div>
        )}

        <div className="password-section">
          <h2>Đổi mật khẩu</h2>
          {!isChangingPassword ? (
            <button
              className="change-password-button"
              onClick={() => setIsChangingPassword(true)}
            >
              Đổi mật khẩu
            </button>
          ) : (
            <form onSubmit={handlePasswordChange} className="password-form">
              <div className="form-group">
                <label>Mật khẩu hiện tại</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Mật khẩu mới</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-button">
                  Cập nhật
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordForm({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                    });
                  }}
                >
                  Hủy
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
