import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const DetailPage = () => {
  const { id } = useParams(); // Lấy id từ URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatVietnameseDate = (dateString) => {
    const date = new Date(dateString);
    const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
    const weekday = days[date.getDay()];
    return `${weekday}, ${date.toLocaleDateString("vi-VN")}`;
  };

  useEffect(() => {
    fetch(`https://stupage.onrender.com/news/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setPost(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API chi tiết bài viết:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (!post) return <p>Không tìm thấy bài viết.</p>;

  return (
    <div className="detail-page">
      <h1>{post.title}</h1>
      <p className="meta">
        Ngày đăng: {formatVietnameseDate(post.created_at)} | Tác giả: {post.author || "STU"}
      </p>
      {post.image_title && (
        <img src={post.image_title} alt={post.title} className="detail-image" />
      )}
      <div className="content-details">
        {post.content_details && post.content_details.map((item, index) => (
          item.text ? (
            <p key={index}>{item.text}</p>
          ) : item.image ? (
            <img key={index} src={item.image} alt={`Hình ảnh ${index}`} className="content-image" />
          ) : null
        ))}
      </div>
    </div>
  );
};

export default DetailPage;
