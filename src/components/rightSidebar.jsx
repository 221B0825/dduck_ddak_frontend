import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// 행정동 분기별 유동인구수 차트
import PopulationQuarter from "./charts/dongCharts/populationQuarter";
// 행정동 시간별 유동인구수 차트
import PopulationTime from "./charts/dongCharts/populationTime";
// 행정동 시간별 매출
import SalesTime from "./charts/dongCharts/salesTime";

// 행정동 별 업종 매출 추이
import IndustrySales from "./charts/dongCharts/industrySales";

// 업종 별 영업 시간
import IndustryBusiness from "./labels/industryBusiness";

// 행정동 별 집객시설 수
import TownFacility from "./charts/dongCharts/townsFacility";

// 점포 수 / 유사 점포 수 동시 차트
import IndustryMulti from "./charts/dongCharts/industryMulti";
// 직장 인구, 거주 인구 수 동시 차트
import PopulationMulti from "./charts/dongCharts/populationMulti";

// 같은 업종, 다른 동 매출 비교 차트
import IndustrySalesComparison from "./charts/dongComparisonCharts/industrySalesComparison";

const RightSidebar = ({ 
  selectedArea, 
  selectCategory, 
  setCompareArea, 
  setBaseArea, 
  baseArea, 
  compareArea, 
  compareMode, 
  setCompareMode,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (compareMode && selectedArea && selectedArea.code !== (baseArea?.code || '')) {
      console.log("Setting compare area:", selectedArea);
      setCompareArea(selectedArea);
    } else if (!compareMode) {
      console.log("Setting base area:", selectedArea);
      setBaseArea(selectedArea);
    }
    console.log("Base area:", baseArea);
    console.log("Compare area:", compareArea);
  }, [selectedArea, compareMode, baseArea, compareArea, setCompareArea, setBaseArea]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleCompareClick = () => {
    setCompareMode((prevCompareMode) => {
      if (!prevCompareMode) {
        setBaseArea(selectedArea);
        setCompareArea(null); // 초기화 후 새로운 비교 영역 선택 대기
      } else {
        setBaseArea(null);
        setCompareArea(null);
      }
      return !prevCompareMode;
    });
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
        style={{ maxHeight: "950px", overflowY: "auto" }}
      >
        {selectedArea ? (
          <>
            <div className="list-group-item list-group-item-action bg-light mt-5">
              <strong>{selectedArea.name} 분석 보고서</strong>
              <br />
            </div>
            <div className="list-group-item list-group-item-action bg-light">
              위치: {selectedArea.name}
            </div>
            <div className="form-check form-switch m-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="compareModeSwitch"
                checked={compareMode}
                onChange={handleCompareClick}
              />
              <label className="form-check-label" htmlFor="compareModeSwitch">
                {compareMode ? "행정동 비교" : "행정동 정보"}
              </label>
            </div>
            <div>
              {compareMode ? (
                baseArea && selectedArea && (
                  <>
                    <IndustrySalesComparison
                      code1={baseArea.code}
                      code2={selectedArea.code}
                      category={"패스트푸드점"}
                    />
                  </>
                )
              ) : (
                <>
                  {selectCategory ? (
                    <>
                      <IndustryMulti
                        code={selectedArea.code}
                        category={selectCategory}
                      />
                      <IndustrySales
                        code={selectedArea.code}
                        category={selectCategory}
                      />
                      <IndustryBusiness
                        code={selectedArea.code}
                        category={selectCategory}
                      />
                    </>
                  ) : (
                    <>
                      <PopulationQuarter code={selectedArea.code} />
                      <PopulationTime code={selectedArea.code} />
                      <SalesTime code={selectedArea.code} />
                    </>
                  )}
                  <PopulationMulti code={selectedArea.code} />
                  <TownFacility code={selectedArea.code} />
                </>
              )}
            </div>
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
