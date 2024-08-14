import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import shopLogoWithoutText from "../assets/icons/shopLogoWithoutText.png";
import LoginModal from "./loginModal";

const CustomHeader = ({ selectedArea }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 세션 스토리지에서 로그인 상태 확인
    const loggedInStatus = sessionStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedInStatus);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    sessionStorage.setItem("isLoggedIn", "true");  // 세션 스토리지에 로그인 상태 저장
  };

  const handleLoginClick = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      setIsLoggedIn(false);
      sessionStorage.removeItem("isLoggedIn");  // 로그아웃 시 세션 스토리지에서 로그인 상태 제거
      alert('로그아웃 되었습니다.');
    }
  };

  const handleScrapClick = async () => {
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
      
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert("스크랩 요청이 성공적으로 처리되었습니다.");
    } catch (error) {
      console.error("스크랩 요청 중 에러가 발생했습니다:", error);
      alert("스크랩 요청에 실패했습니다.");
    }
  };

  return (
    <nav id="customHeader" className="bg-white">
      <a className="navbar-brand " href="#">
        <div id="teamLogoContianer">
          <img src={shopLogoWithoutText} alt="Team Logo" />
        </div>
        <span className="fw-bold">가게뚝딱</span>
      </a>
      <button type="button" className="btn btn-warning m-3" onClick={handleScrapClick}>
        스크랩
      </button>
      <button type="button" className="btn btn-primary me-5" onClick={handleLoginClick}>
        <i className="bi bi-box-arrow-in-right me-2"></i>
        {isLoggedIn ? '로그아웃' : '로그인'}
      </button>
      <LoginModal show={showLoginModal} onHide={() => setShowLoginModal(false)} onLoginSuccess={handleLoginSuccess} />
    </nav>
  );
};

export default CustomHeader;
