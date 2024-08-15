import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

const SalesQuaterComparison = ({
  baseName,
  baseCode,
  selectName,
  selectCode,
}) => {
  const chartRef = useRef(null);
  const [chart, setChart] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);

  const [rank1, setRank1] = useState([]);
  const [rank2, setRank2] = useState([]);

  useEffect(() => {
    console.log("base", baseCode);
    console.log("select", selectCode);

    const fetchData = async () => {
      try {
        const [response1, response2] = await Promise.all([
          axios.get(
            `https://api.gadduck.info/towns/sales/transition?code=${baseCode}`
          ),
          axios.get(
            `https://api.gadduck.info/towns/sales/transition?code=${selectCode}`
          ),
        ]);

        const salesData1 = response1.data.data.salesList;
        const salesData2 = response2.data.data.salesList;

        // 분기 순서를 정의 (이전에 정의된 quarterOrder를 유지)
        const quarterOrder = [
          "2023년 1분기",
          "2023년 2분기",
          "2023년 3분기",
          "2023년 4분기",
          "2024년 1분기",
        ];

        // 분기 순서대로 데이터를 매핑하는 함수
        const mapSalesToQuarters = (salesData) => {
          return quarterOrder.map((q) => {
            const [year, quarter] = q.split("년 ");
            const quarterNumber = parseInt(year) * 10 + parseInt(quarter[0]);
            const record = salesData.find(
              (item) => item.quarter === quarterNumber
            );
            return record ? record.salesOfTown : null;
          });
        };

        const salesOfTown1 = mapSalesToQuarters(salesData1);
        const salesOfTown2 = mapSalesToQuarters(salesData2);

        console.log(salesOfTown1);
        console.log(salesOfTown2);

        if (chart) {
          chart.destroy();
        }

        const ctx = chartRef.current.getContext("2d");
        const newChart = new Chart(ctx, {
          type: "line", // 차트 유형을 선 차트로 변경
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
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
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
                  color: "black", // 여기서 범례 텍스트 색상을 검은색으로 설정
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
  }, [baseCode, selectCode]);

  return (
    <div style={{ margin: "40px" }}>
      {isEmpty ? <p>No data available.</p> : <canvas ref={chartRef}></canvas>}
    </div>
  );
};

export default SalesQuaterComparison;
