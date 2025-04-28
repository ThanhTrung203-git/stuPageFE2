import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import LogoutButton from '../../components/UI/LogoutButton'; // Nhớ import LogoutButton
import './AdminPage.css';

const AdminPage = () => {
  return (
    <div className="admin-container">
      <div className="admin-header">
        <nav className="sidebar">
          <div className="nav-links">
            <Link to="/adminpage/users">Người dùng</Link>
            <Link to="/adminpage/categories">Danh mục tin tức</Link>
            <Link to="/adminpage/news">Tin tức</Link>
            <Link to="/adminpage/news-content">Nội dung tin tức</Link>
          </div>
          <div className="logout-button">
            <LogoutButton />
          </div>
        </nav>
      </div>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminPage;
