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
        <h5 className="ms-3" style={{ fontWeight: "bold" }}>
          {inputDetailCategory} 분기별 매출
        </h5>
        <IndustrySalesCategory
          code={selectedArea.code}
          category={inputDetailCategory}
        />
        <hr />
        {/* 추가적인 차트 구현 필요 */}
      </div>
    </>
  );
};

export default NonCompareModeWithCategory;
