import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // Bootstrap Icons 추가
import { constSelector } from "recoil";

const RightSidebar = ({ isSelectedSize, selectedArea }) => {
  const [isOpen, setIsOpen] = useState(false);
  const chartRef = useRef(null);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    console.log("selectedArea updated in RightSidebar:", selectedArea);
    if (selectedArea && selectedArea.additionalData) {
      const { labels, values, expndtr_totamt } = selectedArea.additionalData;
      setTotalAmount(expndtr_totamt);
      console.log("동별 선택: " + isSelectedSize);
    }
  }, [selectedArea]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      id="rightSidebar-wrapper"
      className="bg-white"
      style={{
        position: "fixed",
        right: 0,
        top: 0,
        height: "100vh",
        zIndex: 2000,
        width: isOpen ? "400px" : "50px",
        transition: "width 0.3s ease-in-out",
      }}
    >
      <button
        id="rightSidebarBtn"
        onClick={toggleSidebar}
        className="btn btn-primary"
        style={{
          position: "absolute",
          top: "50%",
          left: isOpen ? "0px" : "-35px",
          transform: `translateY(-50%) ${
            isOpen ? "translateX(-100%)" : "translateX(0)"
          }`,
        }}
      >
        {isOpen ? (
          <i className="bi bi-caret-right-fill"></i>
        ) : (
          <i className="bi bi-caret-left-fill"></i>
        )}
      </button>
      <div
        className={`sidebar-heading ${
          isOpen ? "show-content" : "hidden-content"
        } mt-4`}
      >
        Right Sidebar
      </div>
      <div
        className={`list-group list-group-flush ${
          isOpen ? "show-content" : "hidden-content"
        }`}
      >
        {selectedArea ? (
          <>
            <div className="list-group-item list-group-item-action bg-light">
              <strong>{selectedArea.name} 분석 보고서</strong>
              <br></br>
            </div>
            <div className="list-group-item list-group-item-action bg-light">
              Name: {selectedArea.name}
            </div>
            <div className="list-group-item list-group-item-action bg-light">
              Code: {selectedArea.adm_cd}
            </div>
            <div className="list-group-item list-group-item-action bg-light">
              Total area: approx {Math.floor(selectedArea.calculatedArea)} m²
            </div>
            <canvas id="myChart" width="400" height="400"></canvas>
            {isSelectedSize ? (
              <div className="list-group-item list-group-item-action bg-light">
                지출 총금액: {totalAmount} 원
              </div>
            ) : (
              <></>
            )}
          </>
        ) : (
          <div className="list-group-item list-group-item-action bg-light">
            No area selected
          </div>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
