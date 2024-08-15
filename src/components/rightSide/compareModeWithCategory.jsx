import React from "react";
import IndustryBusiness from "../labels/industryBusiness";

import SalesCategoryAgeComparison from "../charts/dongComparisonCharts/salesCategoryAgeComparison";
import SalesCategoryGenderComparison from "../charts/dongComparisonCharts/salesCategoryGenderComparison";
import IndustrySalesQuarterComparison from "../charts/dongComparisonCharts/industrySalesQuarterComparison";
import IndustrySalesComparison from "../charts/dongComparisonCharts/industrySalesComparison";
import IndustryStoreComparison from "../charts/dongComparisonCharts/industryStoreComparison";

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
            <span>{selectName} :</span>
            <IndustryBusiness code={selectCode} />년
          </div>
        </div>
      </div>

      {/* 카테고리 분기별 매출 비교 */}
      <div className="chart-container">
        <h5 className="ms-3" style={{ fontWeight: "bold" }}>
          {category} 분기별 매출
        </h5>
        <IndustrySalesQuarterComparison
          baseName={baseName}
          baseCode={baseCode}
          selectCode={selectCode}
          selectName={selectName}
          category={category}
        />
        <hr></hr>
      </div>

      {/* 카테고리 요일별 매출 비교 */}
      <div className="chart-container">
        <h5 className="ms-3" style={{ fontWeight: "bold" }}>
          {category} 요일별 매출
        </h5>
        <IndustrySalesComparison
          baseName={baseName}
          baseCode={baseCode}
          selectCode={selectCode}
          selectName={selectName}
          category={category}
        />
        <hr></hr>
      </div>

      {/* 점포 수 비교 */}
      <div className="chart-container">
        <h5 className="ms-3" style={{ fontWeight: "bold" }}>
          {category} 점포 수
        </h5>
        <IndustryStoreComparison
          baseName={baseName}
          baseCode={baseCode}
          selectCode={selectCode}
          selectName={selectName}
          category={category}
        />
        <hr></hr>
      </div>

      {/* 성별 매출 비교 */}
      <div className="chart-container">
        <h5 className="ms-3" style={{ fontWeight: "bold" }}>
          성별 매출 비교
        </h5>
        <SalesCategoryGenderComparison
          baseName={baseName}
          baseCode={baseCode}
          selectName={selectName}
          selectCode={selectCode}
          category={category}
        />
        <hr></hr>
      </div>

      {/* 연령대 매출 비교 */}
      <div className="chart-container">
        <h5 className="ms-3" style={{ fontWeight: "bold" }}>
          연령대 매출 비교
        </h5>
        <SalesCategoryAgeComparison
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
