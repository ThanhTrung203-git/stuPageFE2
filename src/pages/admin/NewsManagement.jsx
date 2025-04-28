import React, { useState, useEffect } from "react";
import axios from "../../axiosInstance";
import Cookies from "js-cookie";
import NewsContentForm from "./NewsContentForm";
import "./UserManagement.css";


const NewsManagement = () => {
  const [newsList, setNewsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [image, setImage] = useState(null);
  const [selectedNewsIdForContent, setSelectedNewsIdForContent] = useState(null);


  const [formData, setFormData] = useState({
    title: "",
    category_id: "",
    user_id: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getAuthHeaders = () => {
    const token = Cookies.get("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  useEffect(() => {
    fetchNews();
    fetchCategories();
    fetchUsers();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await axios.get("https://stupage.onrender.com/news");
      const data = res.data.data;
      setNewsList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách bài viết:", err);
      setNewsList([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("https://stupage.onrender.com/categories");
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách chuyên mục:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const userCategoryId = Cookies.get("category_id");
  
      if (userCategoryId === "null") {
        // Admin tổng: lấy tất cả user
        const res = await axios.get("https://stupage.onrender.com/user/getall", getAuthHeaders());
        const userData = res.data.data;
        setUsers(Array.isArray(userData) ? userData : userData ? [userData] : []);
      } else {
        // User thường: chỉ lấy thông tin của chính họ
        const res = await axios.get(`https://stupage.onrender.com/user`, getAuthHeaders());
        const userData = res.data.data;
        setUsers(userData ? [userData] : []);
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách người dùng:", err);
      setUsers([]);
    }
  };
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClear = () => {
    setFormData({
      title: "",
      category_id: "",
      user_id: "",
    });
    setImage(null);
    setEditingId(null);
    setSelectedNewsIdForContent(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const userCategoryId = Cookies.get("category_id");
    // Nếu không phải admin tổng => kiểm tra category
    if (userCategoryId !== "null" && formData.category_id !== userCategoryId) {
      alert("Bạn không có quyền thêm/sửa bài viết thuộc chuyên mục này.");
      return;
    }
  
    const form = new FormData();
    form.append("title", formData.title);
    form.append("category_id", formData.category_id);
    form.append("user_id", formData.user_id);
    if (image) form.append("image", image);
  
    try {
      if (editingId) {
        await axios.put(`https://stupage.onrender.com/news/${editingId}`, form, {
          ...getAuthHeaders(),
          headers: {
            ...getAuthHeaders().headers,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await axios.post("https://stupage.onrender.com/news", form, {
          ...getAuthHeaders(),
          headers: {
            ...getAuthHeaders().headers,
            "Content-Type": "multipart/form-data",
          },
        });
      }
      handleClear();
      fetchNews();
    } catch (err) {
      console.error("Lỗi khi gửi dữ liệu bài viết:", err);
    }
  };
  
  

  const handleEdit = (news) => {
    const userCategoryId = Cookies.get("category_id");
    // Nếu không phải admin tổng => kiểm tra quyền chuyên mục
    if (userCategoryId !== "null" && news.category_id !== Number(userCategoryId)) {
      alert("Bạn không có quyền sửa bài viết này.");
      return;
    }
  
    setFormData({
      title: news.title,
      category_id: news.category_id,
      user_id: Cookies.get("user_id"),
    });
    setEditingId(news.id);
  };
  
  
  const handleDelete = async (id, category_id) => {
    const userCategoryId = Cookies.get("category_id");
  
    if (userCategoryId !== "null" && Number(category_id) !== Number(userCategoryId)) {
      alert("Bạn không có quyền xóa bài viết này.");
      return;
    }
  
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) return;
  
    try {
      await axios.delete(`https://stupage.onrender.com/news/${id}`, getAuthHeaders());
      fetchNews();
    } catch (err) {
      console.error("Lỗi khi xóa bài viết:", err);
    }
  };
  
  
  

  const handleAddContent = (newsId) => {
    setSelectedNewsIdForContent(newsId);
  };

  const totalPages = Math.ceil(newsList.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentNews = newsList.slice(indexOfFirst, indexOfLast);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="admin-container">
      <h2 style={{ textAlign: "center", padding: "10px 10px 30px 10px" }}>Quản lý Bài viết</h2>

      {/* Form nhập liệu */}
      <div className="admin-form_container">
        <form onSubmit={handleSubmit} className="admin-form" encType="multipart/form-data">
          <input
            type="text"
            name="title"
            placeholder="Tiêu đề"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
          >
            <option value="">-- Chọn chuyên mục --</option>
            {categories
              .filter((cat) => {
                const userCategoryId = Cookies.get("category_id");
                // Nếu admin tổng => hiện tất cả
                if (userCategoryId === "null") return true;
                // Nếu user thường => chỉ hiện 1 chuyên mục
                return cat.id === Number(userCategoryId);
              })
              .map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
          </select>

          <select name="user_id" value={formData.user_id} onChange={handleChange} required>
            <option value="">-- Chọn người đăng --</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
          <button type="submit">{editingId ? "Cập nhật" : "Thêm mới"}</button>
        </form>
        <button className="btn_refresh" onClick={handleClear}>
          Nhập lại
        </button>
      </div>

      {/* Bảng danh sách */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tiêu đề</th>
            <th>Chuyên mục</th>
            <th>Người đăng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentNews.map((news) => (
            <tr key={news.id}>
              <td>{news.id}</td>
              <td>{news.title}</td>
              <td>{categories.find((cat) => cat.id === news.category_id)?.name || "Không rõ"}</td>
              <td>{users.find((u) => u.id === news.user_id)?.username || "Không rõ"}</td>
              <td>
                <button onClick={() => handleEdit(news)}>Sửa</button>
                <button onClick={() => handleDelete(news.id, news.category_id)}>Xoá</button>
                <button onClick={() => handleAddContent(news.id)}>Thêm nội dung</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phân trang */}
      <div className="pagination">
        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={currentPage === page ? "active" : ""}
          >
            {page}
          </button>
        ))}
        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
          &gt;
        </button>
      </div>

      {/* Form nhập nội dung chi tiết bài viết */}
      {selectedNewsIdForContent && (
        <div style={{ marginTop: "30px" }}>
          <h3 style={{ textAlign: "center" }}>
            Thêm nội dung chi tiết cho bài viết ID: {selectedNewsIdForContent}
          </h3>
          <NewsContentForm newsId={selectedNewsIdForContent} onDone={handleClear} />
        </div>
      )}
    </div>
  );
};
export default NewsManagement;
