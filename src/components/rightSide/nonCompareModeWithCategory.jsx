import React from "react";
import IndustrySalesCategory from "../charts/dongCharts/industrySalesCategory";
import IndustryMulti from "../charts/dongCharts/industryStore";
import IndustrySales from "../charts/dongCharts/industrySalesByDay";
import SalesCategoryGender from "../charts/dongCharts/salesCategoryGender";
import SalesCategoryAge from "../charts/dongCharts/salesCategoryAge";

const NonCompareModeWithCategory = ({ selectedArea, inputDetailCategory }) => {
  return (
    <>
      <div className="chart-container">
        <h5 className="ms-3" style={{ fontWeight: "bold" }}>
          {inputDetailCategory} 점포수
        </h5>
        <IndustryMulti
          code={selectedArea.code}
          category={inputDetailCategory}
        />
        <hr />
        <h5 className="ms-3" style={{ fontWeight: "bold" }}>
          {inputDetailCategory} 매출 요일별
        </h5>
        <IndustrySales
          code={selectedArea.code}
          category={inputDetailCategory}
        />
        <hr />
        <h5 className="ms-3" style={{ fontWeight: "bold" }}>
          {inputDetailCategory} 분기별 매출
        </h5>
        <IndustrySalesCategory
          code={selectedArea.code}
          category={inputDetailCategory}
        />
        <hr />
        <h5 className="ms-3" style={{ fontWeight: "bold" }}>
          {inputDetailCategory} 소비에 대한 성별 비율
        </h5>
        <SalesCategoryGender
          code={selectedArea.code}
          category={inputDetailCategory}
        />
        <hr />
        <h5 className="ms-3" style={{ fontWeight: "bold" }}>
          {inputDetailCategory} 소비에 대한 연령대 비율
        </h5>
        <SalesCategoryAge
          code={selectedArea.code}
          category={inputDetailCategory}
        />
      </div>
    </>
  );
};

export default NonCompareModeWithCategory;
