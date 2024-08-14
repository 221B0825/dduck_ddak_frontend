import React from "react";

const SalesDataTable = ({ data, selectedSubCategory }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          {selectedSubCategory === "비교증가율" ? (
          <><th>순위</th>
          <th>동 이름</th>
          <th>증가율 (%)</th> </>)  :
          (
          <><th>순위</th>
          <th>동 이름</th>
          <th>매출</th> </>)}
         
          {/* <th>분기</th> */}
          {/* <th>산업 이름</th> */}
          {/* <th>해당 분기 매출</th> */}
          {/* <th>매출</th> */}
          {/* <th>매출 차이</th> */}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{item.townName}</td>
            {selectedSubCategory === "비교증가율" ? ( <td>{item.increaseRate.toFixed(2)}%</td>):(<td>{item.sales20241.toLocaleString()}원</td>)}
           
            {/* <td>{item.quarter}</td> */}
            {/* <td>{item.industryName}</td> */}
            {/* <td>{item.sales20234.toLocaleString()}원</td> */}
            {/* <td>{item.sales20241.toLocaleString()}원</td> */}
            {/* <td>{item.salesDifference.toLocaleString()}원</td> */}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SalesDataTable;
