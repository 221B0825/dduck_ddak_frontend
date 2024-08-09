import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import teamLogo from "../assets/icons/teamLogo.png";

const CustomHeader = () => {
  return (
    <nav id="customHeader" className="bg-white">
      <a className="navbar-brand" href="#" style={{ fontSize: "1rem" }}>
        <div id="teamLogoContianer">
          <img src={teamLogo} alt="Team Logo" />
        </div>
        가게뚝딱
      </a>
      <button type="button" className="btn btn-primary">
        <i className="bi bi-box-arrow-left me-2"></i>
        로그아웃
      </button>
    </nav>
  );
};

export default CustomHeader;
