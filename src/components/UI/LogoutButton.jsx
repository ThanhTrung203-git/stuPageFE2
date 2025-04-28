import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("token");        
    Cookies.remove("refreshToken"); 
    Cookies.remove("category_id");   
    navigate("/login");           
  };

  return (
    <button 
      onClick={handleLogout} 
      style={{ padding: "8px 16px", cursor: "pointer", backgroundColor: "#f44336", color: "#fff", border: "none", borderRadius: 4 }}
    >
      Đăng xuất
    </button>
  );
};