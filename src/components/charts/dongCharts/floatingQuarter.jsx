import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

const FloatingQuarter = ({ code }) => {
  const chartRef = useRef(null);
  const [chart, setChart] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.gadduck.info/towns/populations/floating/transition?code=${code}`
        );
  
        const floatingData = response.data.data.populationList;
        console.log(floatingData);
        const quarterOrder = [
          "2023년 1분기",
          "2023년 2분기",
          "2023년 3분기",
          "2023년 4분기",
          "2024년 1분기",
        ];

        const populationOfTown = quarterOrder.map(q => {
          const record = floatingData.find(item => `${Math.floor(item.quarter / 10)}년 ${item.quarter % 10}분기` === q);
          return record ? record.populationOfTown : null;
        });
        console.log(populationOfTown);

        const populationAvgOfCity = quarterOrder.map(q => {
          const record = floatingData.find(item => `${Math.floor(item.quarter / 10)}년 ${item.quarter % 10}분기` === q);
          return record ? record.populationAvgOfCity : null;
        });

        const populationAvgOfDistrict = quarterOrder.map(q => {
          const record = floatingData.find(item => `${Math.floor(item.quarter / 10)}년 ${item.quarter % 10}분기` === q);
          return record ? record.populationAvgOfDistrict : null;
        });

        if (chart) {
          chart.destroy();
        }

        const ctx = chartRef.current.getContext("2d");
        const newChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: quarterOrder,
            datasets: [
              {
                label: `${floatingData[0].townName}`,
                data: populationOfTown,
                backgroundColor: "rgba(54, 162, 235, 0.2)", // 파란색 배경
                borderColor: "rgba(54, 162, 235, 1)", // 파란색 경계
                fill: false
              },
              {
                label: '자치구',
                data: populationAvgOfDistrict,
                borderColor: "rgba(255, 205, 86, 1)",
                backgroundColor: "rgba(255, 205, 86, 0.6)", 
                fill: false
              },
              {
                label: '서울시',
                data: populationAvgOfCity,
                borderColor: "rgba(92,92,92, 1)",
                backgroundColor: "#838383",
                fill: false
              }
            ]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            },
            plugins: {
              legend: {
                labels: {
                  color: 'black'
                }
              }
            }
          }
        });
        setChart(newChart);
      } catch (error) {
        console.error("Failed to fetch area data", error);
        setIsEmpty(true);
      }
    };

    fetchData();
  }, [code, chartRef, isEmpty]);

  return (
    <div style={{ margin: "40px" }}>
      {isEmpty ? (
        <p>No data available.</p>
      ) : (
        <canvas ref={chartRef}></canvas>
      )}
    </div>
  );
};

export default FloatingQuarter;
