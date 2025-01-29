import { useState, useEffect } from 'react';
import '../styles/UserManagement.css';
import Notification from '../components/Notification';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [notification, setNotification] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [passwordReset, setPasswordReset] = useState({
    userId: null,
    newPassword: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/users', {
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.message,
      });
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:8080/api/users/${editingUser._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({
            username: editingUser.username,
            role: editingUser.role,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      setNotification({
        type: 'success',
        message: 'User updated successfully',
      });

      fetchUsers();
      setEditingUser(null);
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.message,
      });
    }
  };

  const handleResetPassword = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:8080/api/users/${userId}/reset-password`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({
            newPassword: passwordReset.newPassword,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to reset password');
      }

      setNotification({
        type: 'success',
        message: 'Password reset successfully',
      });

      setPasswordReset({ userId: null, newPassword: '' });
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.message,
      });
    }
  };

  return (
    <div className="user-management">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="user-management-container">
        <h1>Quản lý người dùng</h1>

        <div className="users-list">
          {users.map((user) => (
            <div key={user._id} className="user-card">
              {editingUser && editingUser._id === user._id ? (
                <form onSubmit={handleUpdateUser} className="edit-user-form">
                  <div className="form-group">
                    <label>Tên đăng nhập</label>
                    <input
                      type="text"
                      value={editingUser.username}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          username: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Vai trò</label>
                    <select
                      value={editingUser.role}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          role: e.target.value,
                        })
                      }
                    >
                      <option value="user">Người dùng</option>
                      <option value="admin">Quản trị viên</option>
                    </select>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="save-button">
                      Lưu
                    </button>
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() => setEditingUser(null)}
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="user-info">
                    <h3>{user.username}</h3>
                    <span className={`role-badge ${user.role}`}>
                      {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                    </span>
                  </div>
                  <div className="user-actions">
                    <button
                      className="edit-button"
                      onClick={() => setEditingUser(user)}
                    >
                      Sửa
                    </button>
                    <button
                      className="reset-password-button"
                      onClick={() =>
                        setPasswordReset({ userId: user._id, newPassword: '' })
                      }
                    >
                      Đổi mật khẩu
                    </button>
                  </div>
                </>
              )}

              {passwordReset.userId === user._id && (
                <div className="password-reset-form">
                  <input
                    type="password"
                    placeholder="Mật khẩu mới"
                    value={passwordReset.newPassword}
                    onChange={(e) =>
                      setPasswordReset({
                        ...passwordReset,
                        newPassword: e.target.value,
                      })
                    }
                  />
                  <div className="form-actions">
                    <button
                      className="save-button"
                      onClick={() => handleResetPassword(user._id)}
                    >
                      Xác nhận
                    </button>
                    <button
                      className="cancel-button"
                      onClick={() =>
                        setPasswordReset({ userId: null, newPassword: '' })
                      }
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserManagement;
