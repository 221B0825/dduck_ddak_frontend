import React from "react";
import { Modal, Button } from "react-bootstrap";
import shopLogo from "../assets/icons/shopLogo.png";
import kakaoLogin from "../assets/icons/kakaoLogin.png";
import naverLogin from "../assets/icons/naverLogin.png";

const LoginModal = ({ show, onHide, onLoginSuccess }) => {
  const handleKakaoLogin = () => {
    window.location.href =
      "https://api.gadduck.info/oauth2/authorization/kakao";
    
    onLoginSuccess();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>로그인</Modal.Title>
      </Modal.Header>
      <Modal.Body
        className="text-center"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src={shopLogo}
          alt="Team Logo"
          style={{ width: "100px", marginBottom: "20px", marginRight: "20px" }}
        />
        <Button
          onClick={handleKakaoLogin}
          style={{
            marginBottom: "10px",
            padding: 0,
            backgroundColor: "#fff",
            border: 0,
          }}
        >
          <img src={kakaoLogin} />
        </Button>

        <Button
          style={{ margin: 0, padding: 0, backgroundColor: "#fff", border: 0 }}
        >
          <img src={naverLogin} style={{ width: "183px", height: "45px" }} />
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
