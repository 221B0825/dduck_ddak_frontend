import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// 차트 및 기타 컴포넌트 임포트
import PopulationQuarter from "./charts/dongCharts/populationQuarter";
import PopulationTime from "./charts/dongCharts/populationTime";
import SalesTime from "./charts/dongCharts/salesTime";
import IndustrySales from "./charts/dongCharts/industrySales";
import IndustryBusiness from "./labels/industryBusiness";
import TownFacility from "./charts/dongCharts/townsFacility";
import IndustryMulti from "./charts/dongCharts/industryMulti";
import PopulationMulti from "./charts/dongCharts/populationMulti";
import IndustrySalesComparison from "./charts/dongComparisonCharts/industrySalesComparison";

import categoryData from "../apis/searchCategory.json";

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
  const [inputCategory, setinputCategory] = useState("");
  const [inputDetailCategory, setInputDetailCategory] = useState("");
  const [filteredCategoryList, setFilteredCategoryList] = useState([]);

  const handleCategoryChange = (e) => {
    setinputCategory(e.target.value);
  };

  const handleDetailCategoryChange = (e) => {
    setInputDetailCategory(e.target.value);
  };

  useEffect(() => {
    if (inputCategory) {
      const detailList = categoryData.하위카테고리[inputCategory] || [];
      setFilteredCategoryList(detailList);
      setinputCategory(inputCategory);
    } else {
      setFilteredCategoryList([]);
    }
    setInputDetailCategory("");
  }, [inputCategory]);

  useEffect(() => {
    if (
      compareMode &&
      selectedArea &&
      selectedArea.code !== (baseArea?.code || "")
    ) {
      console.log("Setting compare area:", selectedArea);
      setCompareArea(selectedArea);
    } else if (!compareMode) {
      console.log("Setting base area:", selectedArea);
      setBaseArea(selectedArea);
    }
    console.log("Base area:", baseArea);
    console.log("Compare area:", compareArea);
  }, [
    selectedArea,
    compareMode,
    baseArea,
    compareArea,
    setCompareArea,
    setBaseArea,
  ]);

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
        credentials: "include", // 쿠키를 포함시키기 위해 credentials 설정
        body: JSON.stringify({
          email: "hyeri0603@naver.com",
          "town-code": selectedArea.code,
          "industry-name": selectCategory,
          quarter: 20241,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      alert("스크랩 요청이 성공적으로 처리되었습니다.");
    } catch (error) {
      console.error("스크랩 요청 중 에러가 발생했습니다:", error);
      alert("스크랩 요청에 실패했습니다.");
    }
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
            <button
              type="button"
              className="btn btn-warning m-3"
              onClick={handleScrapClick}
            >
              스크랩
            </button>
            <div>
              {/* 카테고리 선택 */}
              <div>
                <select
                  className="form-select"
                  value={inputCategory}
                  onChange={handleCategoryChange}
                  style={{ marginBottom: "10px" }}
                  disabled={!isOpen} // 사이드바가 닫혀 있으면 선택 불가
                >
                  <option value="">카테고리 선택</option>
                  {categoryData.상위카테고리.map((상위카테고리) => (
                    <option key={상위카테고리} value={상위카테고리}>
                      {상위카테고리}
                    </option>
                  ))}
                </select>

                {/* 하위 카테고리 선택 */}
                <select
                  className="form-select"
                  value={inputDetailCategory}
                  onChange={handleDetailCategoryChange}
                  style={{ marginBottom: "10px" }}
                  disabled={!inputCategory || !isOpen} // 상위 카테고리가 선택되지 않았거나 사이드바가 닫혀 있으면 선택 불가
                >
                  <option value="">하위 카테고리 선택</option>
                  {filteredCategoryList.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {compareMode ? (
                baseArea &&
                selectedArea && (
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
