import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

const IndustrySalesTimeComparison = ({
  baseName,
  baseCode,
  selectName,
  selectCode,
  category,
}) => {
  const chartRef = useRef(null);
  const [chart, setChart] = useState(null);
  const [commentBase, setCommentBase] = useState("");
  const [commentSelect, setCommentSelect] = useState("");
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [response1, response2] = await Promise.all([
          axios.get(
            `https://api.gadduck.info/towns/industry/sales/transition?code=${baseCode}&industryName=${category}`
          ),
          axios.get(
            `https://api.gadduck.info/towns/industry/sales/transition?code=${selectCode}&industryName=${category}`
          ),
        ]);

        const salesData1 = response1.data.data.salesList;
        const salesData2 = response2.data.data.salesList;

        const quarterOrder = [
          "2023년 1분기",
          "2023년 2분기",
          "2023년 3분기",
          "2023년 4분기",
          "2024년 1분기",
        ];

        // baseCode 데이터의 최근 두 분기 비교
        const lastBase = salesData1[salesData1.length - 1].salesOfTown;
        const secondLastBase = salesData1[salesData1.length - 2].salesOfTown;

        // selectCode 데이터의 최근 두 분기 비교
        const lastSelect = salesData2[salesData2.length - 1].salesOfTown;
        const secondLastSelect = salesData2[salesData2.length - 2].salesOfTown;

        setCommentBase(
          lastBase < secondLastBase ? "감소 중" : "증가 중 또는 안정"
        );
        setCommentSelect(
          lastSelect < secondLastSelect ? "감소 중" : "증가 중 또는 안정"
        );

        const salesOfTown1 = quarterOrder.map((q) => {
          const record = salesData1.find(
            (item) =>
              `${Math.floor(item.quarter / 10)}년 ${item.quarter % 10}분기` ===
              q
          );
          return record ? record.salesOfTown : null;
        });

        const salesOfTown2 = quarterOrder.map((q) => {
          const record = salesData2.find(
            (item) =>
              `${Math.floor(item.quarter / 10)}년 ${item.quarter % 10}분기` ===
              q
          );
          return record ? record.salesOfTown : null;
        });

        if (chart) {
          chart.destroy();
        }

        const ctx = chartRef.current.getContext("2d");
        const newChart = new Chart(ctx, {
          type: "line",
          data: {
            labels: quarterOrder,
            datasets: [
              {
                label: baseName,
                data: salesOfTown1,
                backgroundColor: "rgba(54, 162, 235, 0.2)", // 파란색 배경
                borderColor: "rgba(54, 162, 235, 1)", // 파란색 경계
                fill: false,
              },
              {
                label: selectName,
                data: salesOfTown2,
                backgroundColor: "rgba(255, 99, 132, 0.2)", // 다홍색 배경
                borderColor: "rgba(255, 99, 132, 1)", // 다홍색 경계
                fill: false,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
            plugins: {
              legend: {
                labels: {
                  color: "black",
                },
              },
            },
          },
        });
        setChart(newChart);
      } catch (error) {
        console.error("Failed to fetch area data", error);
        setIsEmpty(true);
      }
    };

    fetchData();
  }, [baseCode, selectCode, category]);

  return (
    <div style={{ margin: "40px" }}>
      {isEmpty ? <p>No data available.</p> : <canvas ref={chartRef}></canvas>}

      <br></br>
      <div style={{ textAlign: "center" }}>
        <h5
          className="m-2"
          style={{
            border: "1px solid #D9D9D9",
            borderRadius: "5px",
            padding: "10px",
          }}
        >{`전 분기 대비 매출`}</h5>
        <h5>
          {`${baseName} : `}
          <strong className="text-primary">{commentBase}</strong>
        </h5>
        <h5>
          {`${selectName} : `}
          <strong className="text-primary">{commentSelect}</strong>
        </h5>
      </div>
    </div>
  );
};

export default IndustrySalesTimeComparison;
