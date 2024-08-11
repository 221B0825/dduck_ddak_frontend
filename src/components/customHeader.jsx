import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import shopLogoWithoutText from "../assets/icons/shopLogoWithoutText.png";
import LoginModal from "./loginModal";

const CustomHeader = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  return (
    <nav id="customHeader" className="bg-white">
      <a className="navbar-brand" href="#" style={{ fontSize: "1rem" }}>
        <div id="teamLogoContianer">
          <img src={shopLogoWithoutText} alt="Team Logo" />
        </div>
        가게뚝딱
      </a>
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleLoginClick}
      >
        <i className="bi bi-box-arrow-in-right me-2"></i>
        로그인
      </button>

      {/* 로그인 모달 */}
      <LoginModal
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
      />
    </nav>
  );
};

export default CustomHeader;
