import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import teamLogo from "../assets/icons/teamLogo.png";

const CustomHeader = ({ setSelectedSize }) => {
  const [isChecked, setIsChecked] = useState(true);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    if (isChecked) {
      setSelectedSize("행정구 별 선택");
    } else {
      setSelectedSize("행정동 별 선택");
    }
  };

  return (
    <nav
      id="customHeader"
      className="navbar navbar-expand-lg navbar-light bg-white"
    >
      <a className="navbar-brand" href="#" style={{ fontSize: "1rem" }}>
        <div id="teamLogoContianer">
          <img src={teamLogo} alt="Team Logo" />
        </div>
        가게뚝딱
      </a>
      <div id="areaSetting">
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="flexSwitchCheckChecked"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
          <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
            {isChecked ? "행정동 별 선택" : "행정구 별 선택"}
          </label>
        </div>
      </div>
      <button type="button" className="btn btn-primary">
        <i className="bi bi-box-arrow-left me-2"></i>
        로그아웃
      </button>
    </nav>
  );
};

export default CustomHeader;
