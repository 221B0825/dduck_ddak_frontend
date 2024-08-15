import React from "react";
import IndustryBusiness from "../labels/industryBusiness";
import IndustrySalesComparison from "../charts/dongComparisonCharts/industrySalesComparison";
import PopulationTransitionComparison from "../charts/dongComparisonCharts/populationTransitionComparison";

const CompareModeWithCategory = ({
  baseName,
  baseCode,
  selectName,
  selectCode,
  category,
}) => {
  return (
    <>
      {/* 점포 평균 영업기간 비교 */}
      <div className="chart-container">
        <h5 className="ms-3" style={{ fontWeight: "bold" }}>
          {category} 점포 평균 영업기간
        </h5>
        <div
          id="row"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className=""
            style={{
              border: "1px solid #D9D9D9",
              borderRadius: "5px",
              margin: "10px",
              textAlign: "center",
              padding: "5px",
            }}
          >
            <span>{baseName} :</span>
            <IndustryBusiness code={baseCode} />년
          </div>

          <div
            className=""
            style={{
              border: "1px solid #D9D9D9",
              borderRadius: "5px",
              margin: "10px",
              textAlign: "center",
              padding: "5px",
            }}
          >
            <span>{baseName} :</span>
            <IndustryBusiness code={baseCode} />년
          </div>
        </div>
      </div>

      {/* 전체 매출 비교 */}
      <div className="chart-container">
        <IndustrySalesComparison
          baseName={baseName}
          baseCode={baseCode}
          selectCode={selectCode}
          selectName={selectName}
          category={"전체"}
        />
      </div>

      {/* 분기별 유동인구 비교 */}
      <div className="chart-container">
        <PopulationTransitionComparison
          baseName={baseName}
          baseCode={baseCode}
          selectName={selectName}
          selectCode={selectCode}
          category={category}
        />
      </div>
    </>
  );
};

export default CompareModeWithCategory;
