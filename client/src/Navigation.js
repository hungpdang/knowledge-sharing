import { Link, useLocation } from 'react-router-dom';
import './styles/Navigation.css';
import { useEffect, useState } from 'react';

function Navigation() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          'http://localhost:8080/api/users/profile',
          {
            headers: {
              Authorization: token,
            },
          }
        );

        if (response.ok) {
          const userData = await response.json();
          setIsAdmin(userData.role === 'admin');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    checkAdminStatus();
  }, []);
  return (
    <nav className="main-nav">
      <div className="nav-brand">Knowledge Sharing</div>
      <div className="nav-links">
        <Link
          to="/dashboard"
          className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
        >
          Trang chủ
        </Link>
        <Link
          to="/news"
          className={`nav-link ${isActive('/news') ? 'active' : ''}`}
        >
          Quản lý tin tức
        </Link>
        {isAdmin && (
          <Link
            to="/users"
            className={`nav-link ${isActive('/users') ? 'active' : ''}`}
          >
            Quản lý người dùng
          </Link>
        )}
        <Link
          to="/profile"
          className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
        >
          Thông tin tài khoản
        </Link>
        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
        >
          Đăng xuất
        </button>
      </div>
    </nav>
  );
}

export default Navigation;
