import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// 행정동 분기별 유동인구수 차트
import PopulationQuarter from "./charts/populationQuarter";
// 행정동 시간별 유동인구수 차트
import PopulationTime from "./charts/populationTime";
// 행정동 시간별 매출
import SalesTime from "./charts/salesTime";
// 행정동 별 점포 추이
import IndustryRecently from "./charts/industryRecently";
// 행정동 별 업종 매출 추이
import IndustrySales from "./charts/industrySales";

// 자치구 별 점포 추이
import GuIndustryRecently from "./charts/guCharts/guIndustryRecently";

// 유사 점포 수 추이
import IndustrySimilar from "./charts/industrySimilar";

// 업종 별 영업 시간
import IndustryBusiness from "./charts/industryBusiness";

// 행정동 분기별 거주인구수 차트
import PopulationResidentQuarter from "./charts/populationResidentQuarter";

// 행정동 분기별 직장 인구수 차트
import PopulationWorkingQuarter from "./charts/populationWorkingQuarter";

// 행정동 별 집객시설 수
import TownFacility from "./charts/townsFacility";

// 점포 수 / 유사 점포 수 동시 차트
import IndustryComparison from "./charts/industryComparison";
// 직장 인구, 거주 인구 수 동시 차트
import PopulationComparison from "./charts/populationComparison";

import IndustrySalesComparison from "./charts/test";

const RightSidebar = ({ isSelectedSize, selectedArea, selectCategory }) => {
  const [isOpen, setIsOpen] = useState(true);

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
        style={{ maxHeight: "950px", overflowY: "auto" }}
      >
        {selectedArea ? (
          <>
            <div className="list-group-item list-group-item-action bg-light mt-5">
              <strong>{selectedArea.name} 분석 보고서</strong>
              <br></br>
            </div>
            <div className="list-group-item list-group-item-action bg-light">
              위치: {selectedArea.name}
            </div>
            {/* <div className="list-group-item list-group-item-action bg-light">
              Code: {selectedArea.code}
            </div>
            <div className="list-group-item list-group-item-action bg-light">
              Total area: approx {Math.floor(selectedArea.calculatedArea)} m²
            </div> */}
            <div>
              {isSelectedSize ? (
                <>
                  
                  {selectCategory ? (
                    <>
                      {/* 카테고리 선택 시 */}
                      
                      
                      {/* 업종 점포 수 추이 */}
                      {/* <IndustryRecently
                        code={selectedArea.code}
                        category={selectCategory}
                      /> */}
                      {/* 유사 업종 점포 수 추이 */}
                      {/* <IndustrySimilar
                        code={selectedArea.code}
                        category={selectCategory}
                      /> */}

                        {/* 업종 점포 수와 유사 점포 수 합한 차트 */}
                        
                        <IndustryComparison code={selectedArea.code} category={selectCategory} />

                      {/* 업종 일자별 매출 */}
                      <IndustrySales
                        code={selectedArea.code}
                        category={selectCategory}
                      />
                      {/* 업종별 평균 영업시간 */}
                      <IndustryBusiness code={selectedArea.code}
                        category={selectCategory}/>
                      
                      <IndustrySalesComparison  code1={selectedArea.code} code2={11530780} category={selectCategory} />
                    </>
                  ) : (
                    // 카테고리 선택 X
                    <div>
                  {/* 행정동 분기별 유동인구 */}
                  <PopulationQuarter code={selectedArea.code} />
                  {/* 행정동 시간별 유동인구 */}
                  <PopulationTime code={selectedArea.code} />
                  {/* 행정동 시간별 매출 추이 */}
                  <SalesTime code={selectedArea.code} />

                    </div>
                  )}

                  {/* 거주 인구 수 */}
                  {/* <PopulationResidentQuarter code={selectedArea.code} /> */}
                  {/* 직장 인구 수 */}
                  {/* <PopulationWorkingQuarter code={selectedArea.code}/> */}

                  {/* 직장 인구 수 / 거주 인구 수 동시 차트 */}
                  <PopulationComparison code={selectedArea.code}/>

                  {/* 집객시설 수 */}
                  <TownFacility code={selectedArea.code}/>
                  <div style={{ marginBottom: "100px" }}></div>
                </>
              ) : (
                // 구별 선택 시
                <div>
                  <GuIndustryRecently code={selectedArea.code} category={selectCategory} />
                </div>
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
