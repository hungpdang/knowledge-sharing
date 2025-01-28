import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginScreen.css'; // We can reuse the same styles
import Notification from '../components/Notification';
function SignupScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setNotification({
        type: 'success',
        message: 'Registration successful! Redirecting to login...',
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message);
      setNotification({
        type: 'error',
        message: err.message,
      });
    }
  };

  return (
    <>
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h1>Tạo tài khoản</h1>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="role-select"
            >
              <option value="user">Người dùng</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>
          <button type="submit" className="login-button">
            Đăng ký
          </button>
          <div className="auth-switch">
            Đã có tài khoản?{' '}
            <button
              onClick={() => navigate('/login')}
              className="auth-switch-button"
            >
              Đăng nhập
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default SignupScreen;
