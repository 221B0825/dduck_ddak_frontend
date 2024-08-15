import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import shopLogoWithoutText from "../assets/icons/shopLogoWithoutText.png";
import LoginModal from "./loginModal";
import ScrapSelector from "../components/scrap/scrapSelector";
import swal from "sweetalert";

const CustomHeader = ({ selectedArea, setSelectQuery }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrapEmpty, setScrapEmpty] = useState(false);

  useEffect(() => {
    const loggedInStatus = sessionStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedInStatus);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    sessionStorage.setItem("isLoggedIn", "true");
  };

  const handleLoginClick = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      setIsLoggedIn(false);
      sessionStorage.removeItem("isLoggedIn");
      swal({
        title: "로그아웃 완료",
        text: "로그아웃이 정상적으로 처리되었습니다.",
        icon: "success",
        button: "확인",
      });
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
          townCode: parseInt(selectedArea.code),
          quarter: 20241,
        }),
      });

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        setScrapEmpty(true);
      }

      swal({
        title: "스크랩 확인",
        text: "스크랩 요청이 성공적으로 처리되었습니다.",
        icon: "success",
        button: "확인",
      });
    } catch (error) {
      console.error("스크랩 요청 중 에러가 발생했습니다:", error);
      swal({
        title: "스크랩 실패",
        text: "스크랩 요청 중 에러가 발생했습니다.\n로그인하셨는지 확인해주세요!",
        icon: "error",
        button: "확인",
      });
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
      <div
        id="rightArea"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button
          type="button"
          className="btn btn-warning m-3"
          onClick={handleScrapClick}
        >
          <i class="bi bi-archive-fill"></i> 스크랩
        </button>
        {isLoggedIn && isScrapEmpty ? (
          <ScrapSelector
            setSelectQuery={setSelectQuery}
            setScrapEmpty={setScrapEmpty}
            style={{ marginLeft: "0px", marginRight: "0px" }}
          />
        ) : null}

        <button
          type="button"
          className="btn btn-primary me-5"
          onClick={handleLoginClick}
        >
          <i className="bi bi-box-arrow-in-right me-2"></i>
          {isLoggedIn ? "로그아웃" : "로그인"}
        </button>
      </div>
      <LoginModal
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </nav>
  );
};

export default CustomHeader;
