import React from "react";
import IndustryBusiness from "../labels/industryBusiness";
import PopulationQuarterComparison from "../charts/dongComparisonCharts/populationQuarterComparison";
import IndustrySalesComparison from "../charts/dongComparisonCharts/industrySalesComparison";
import SalesQuaterComparison from "../charts/dongComparisonCharts/salseQuaterComparison";
import PopulationTimeComparison from "../charts/dongComparisonCharts/populationTimeComparison";
import TownFacilityComparison from "../charts/dongComparisonCharts/townFacilityComparison";

const CompareMode = ({ baseArea, selectedArea }) => {
  return (
    <>
      <div className="chart-container">
        <h5 className="ms-3" style={{ fontWeight: "bold" }}>
          점포 평균 영업기간
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
            <span>{baseArea.name.replace("서울특별시 ", "")}: </span>
            <IndustryBusiness code={baseArea.code} />년
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
            <span>{selectedArea.name.replace("서울특별시 ", "")}: </span>
            <IndustryBusiness code={selectedArea.code} />년
          </div>
        </div>
      </div>

      <div className="chart-container">
        <h5 className="ms-3" style={{ fontWeight: "bold" }}>
          분기별 유동인구 수
        </h5>
        <PopulationQuarterComparison
          baseName={baseArea.name.replace("서울특별시 ", "")}
          code1={baseArea.code}
          selectName={selectedArea.name.replace("서울특별시 ", "")}
          code2={selectedArea.code}
        />
        <hr />
      </div>

      <div className="chart-container">
        <h5 className="ms-3" style={{ fontWeight: "bold" }}>
          분기별 매출 추이
        </h5>
        <SalesQuaterComparison
          baseName={baseArea.name.replace("서울특별시 ", "")}
          baseCode={baseArea.code}
          selectName={selectedArea.name.replace("서울특별시", "")}
          selectCode={selectedArea.code}
        />
        <hr />
      </div>

      <div className="chart-container">
        <h5 className="ms-3" style={{ fontWeight: "bold" }}>
          시간대별 유동인구 수
        </h5>
        <PopulationTimeComparison
          baseName={baseArea.name.replace("서울특별시 ", "")}
          baseCode={baseArea.code}
          selectName={selectedArea.name.replace("서울특별시", "")}
          selectCode={selectedArea.code}
        />
        <hr></hr>
      </div>

      <div className="chart-container">
        <h5 className="ms-3 mt-3" style={{ fontWeight: "bold" }}>
          전체 매출 시간대별 추이
        </h5>
        <IndustrySalesComparison
          baseName={baseArea.name.replace("서울특별시 ", "")}
          baseCode={baseArea.code}
          selectName={selectedArea.name.replace("서울특별시 ", "")}
          selectCode={selectedArea.code}
          category={"전체"}
        />
        <hr />
      </div>

      <div className="chart-container">
        <h5 className="ms-3 mt-3" style={{ fontWeight: "bold" }}>
          집객시설 개수
        </h5>
        <TownFacilityComparison
          baseName={baseArea.name.replace("서울특별시 ", "")}
          baseCode={baseArea.code}
          selectName={selectedArea.name.replace("서울특별시 ", "")}
          selectCode={selectedArea.code}
        />
      </div>
    </>
  );
};

export default CompareMode;
