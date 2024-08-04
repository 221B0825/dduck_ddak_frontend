import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// 분기별 유동인구수 차트
import PopulationQuarter from "./charts/populationQuarter";
// 시간별 유동인구수 차트
import PopulationTime from "./charts/populationTime";
// 시간별 매출
import SalesTime from "./charts/salesTime";

const RightSidebar = ({ isSelectedSize, selectedArea }) => {
  const [isOpen, setIsOpen] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    console.log("selectedArea updated in RightSidebar:", selectedArea);
  }, [selectedArea]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      id="rightSidebar-wrapper"
      className="bg-white md-5"
      style={{
        position: "fixed",
        right: 0,
        top: 0,
        height: "100vh",
        zIndex: 2000,
        width: isOpen ? "550px" : "50px",
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
        className={`list-group list-group-flush ${
          isOpen ? "show-content" : "hidden-content"
        }`}
        style={{ maxHeight: "900px", overflowY: "auto" }}
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
              Code: {selectedArea.code}
            </div>
            <div className="list-group-item list-group-item-action bg-light">
              Total area: approx {Math.floor(selectedArea.calculatedArea)} m²
            </div>

            {isSelectedSize ? (
              // 행정동별 보고서 내용
              <>
                <PopulationQuarter code={selectedArea.code} />
                <PopulationTime code={selectedArea.code} />
                <SalesTime code={selectedArea.code} />
              </>
            ) : (
              // 자치구별 보고서 내용
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
