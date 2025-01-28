import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginScreen.css';
import Notification from '../components/Notification';

function LoginScreen({ setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      // Store the token
      localStorage.setItem('token', data.token);

      // Update authentication state
      setIsAuthenticated(true);

      // Show success notification
      setNotification({
        type: 'success',
        message: 'Login successful! Redirecting...',
      });

      // Navigate to news page after successful login
      setTimeout(() => {
        navigate('/news', { replace: true });
      }, 1500);
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
          <h1>Chào mừng trở lại</h1>
          {error && <div className="error-text">{error}</div>}
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
          <button type="submit" className="login-button">
            Đăng nhập
          </button>
          <div className="auth-switch">
            Không có tài khoản?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="auth-switch-button"
            >
              Đăng ký
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default LoginScreen;
