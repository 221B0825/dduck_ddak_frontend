import React, { useState, useEffect } from "react";

import IndustryBusiness from "../labels/industryBusiness";
// import PopulationQuarter from "../charts/dongCharts/populationQuarter";
import FloatingQuarter from "../charts/dongCharts/floatingQuarter";
import SalesQuater from "../charts/dongCharts/salesQuater";
import PopulationTime from "../charts/dongCharts/populationTime";
import SalesTime from "../charts/dongCharts/salesTime";
import TownFacility from "../charts/dongCharts/townsFacility";
import PopulationMulti from "../charts/dongCharts/populationMulti";

const NonCompareMode = ({ selectedArea }) => {
  return (
    <>
      {/* 점포 영업기간 */}
      <h5 className="ms-3" style={{ fontWeight: "bold" }}>
        점포 평균 영업기간
      </h5>
      <div
        className="chart-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="col-7 mt-3"
          style={{
            display: "inline",
            border: "1px solid #D9D9D9",
            borderRadius: "5px",
            margin: "10px",
            textAlign: "center",
          }}
        >
          {"점포 평균 영업기간: "}
          <IndustryBusiness code={selectedArea.code} />
          {" 년"}
        </div>
      </div>
      {/* 분기별 매출 유동인구 추이 */}
      <div className="chart-container">
        <h5 className="ms-3" style={{ fontWeight: "bold" }}>
          분기별 유동인구
        </h5>
        <FloatingQuarter code={selectedArea.code} />
        <hr></hr>
      </div>

      {/* 분기별 매출 구/시 합본 */}
      <div className="chart-container">
        <h5 className="ms-3" style={{ fontWeight: "bold" }}>
          분기별 매출
        </h5>
        <SalesQuater code={selectedArea.code} />
        <hr></hr>
      </div>

      {/* 시간대별 유동인구 */}
      <div className="chart-container">
        <h5 className="ms-3" style={{ fontWeight: "bold" }}>
          시간대별 유동인구
        </h5>
        <PopulationTime code={selectedArea.code} />

        <div style={{ textAlign: "center" }}>
          <hr></hr>
        </div>
      </div>

      {/* 직장유동인구/주거 인구 2024년1분기만 */}
      <div className="chart-container">
        <h5 className="ms-3" style={{ fontWeight: "bold" }}>
          직장/주거 인구
        </h5>
        <PopulationMulti code={selectedArea.code} />
      </div>
      <hr></hr>

      {/* 시간대별 매출 - 업종 전체 */}
      <div className="chart-container">
        <h5 className="ms-3" style={{ fontWeight: "bold" }}>
          시간대별 매출
        </h5>
        <SalesTime code={selectedArea.code} />
      </div>

      {/* 집객시설 */}
      <div className="chart-container">
        <h5 className="ms-3" style={{ fontWeight: "bold" }}>
          집객 시설 개수
        </h5>
        <TownFacility code={selectedArea.code} />
      </div>
    </>
  );
};

export default NonCompareMode;
