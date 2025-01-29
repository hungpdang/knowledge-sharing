import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

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
