import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import teamLogo from "../assets/icons/teamLogo.png";

const CustomHeader = ({ setSelectedSize, setSelectedArea }) => {
  const [isChecked, setIsChecked] = useState(true);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    setSelectedSize(!isChecked);
    setSelectedArea("");
  };

  useEffect(() => {
    console.log("isCheckedUpdate:", isChecked, " : ");
  }, [isChecked]);

  return (
    <nav
      id="customHeader"
      className="bg-white"
    
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
            {isChecked ? "행정동 별 선택" : "자치구 별 선택"}
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
