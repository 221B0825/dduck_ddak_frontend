import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import shopLogoWithoutText from "../assets/icons/shopLogoWithoutText.png";
import LoginModal from "./loginModal";

const CustomHeader = (selectedArea) => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleScrapClick = () => {
    sendScrapRequest(); // 함수 호출
  };

  const sendScrapRequest = async () => {
    try {
      const response = await fetch("https://api.gadduck.info/scraps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "hyeri0603@naver.com",
          townCode: parseInt(selectedArea.selectedArea.code),
          quarter: 20241,
        }),
      });
      
      if (response.status != 200) {
        console.log(response);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log(response);

      alert("스크랩 요청이 성공적으로 처리되었습니다.");
    } catch (error) {
      console.error("스크랩 요청 중 에러가 발생했습니다:", error);
      alert("스크랩 요청에 실패했습니다.");
    }
  };

  return (
    <nav id="customHeader" className="bg-white">
      <a className="navbar-brand " href="#" style={{ fontSize: "1rem" }}>
        <div id="teamLogoContianer">
          <img src={shopLogoWithoutText} alt="Team Logo" />
        </div>
        <span className="fw-bold">가게뚝딱</span>
        
      </a>

      <button
        type="button"
        className="btn btn-warning m-3"
        onClick={handleScrapClick}>
      스크랩
      </button>

      <button
        type="button"
        className="btn btn-primary me-5"
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
