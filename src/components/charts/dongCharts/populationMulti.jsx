import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

const PopulationMulti = ({ code }) => {
  const chartRef = useRef(null);
  const [chart, setChart] = useState(null);
  const [count, setCount] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data for PopulationWorkingQuarter
        const workingResponse = await axios.get(
          `https://api.gadduck.info/towns/populations/working/quarter?code=${code}`
        );
        const workingData = workingResponse.data.data.populationList;

        // Fetch data for PopulationResidentQuarter
        const residentResponse = await axios.get(
          `https://api.gadduck.info/towns/populations/resident/quarter?code=${code}`
        );
        const residentData = residentResponse.data.data.populationList;

        // Define the order of quarters
        const quarterOrder = [
          "2023년 1분기",
          "2023년 2분기",
          "2023년 3분기",
          "2023년 4분기",
          "2024년 1분기",
        ];

        // Convert data to chart-compatible format and order it
        const workingMapped = workingData.map((item) => ({
          quarter: `${Math.floor(item.quarter / 10)}년 ${
            item.quarter % 10
          }분기`,
          population: item.population,
        }));

        const residentMapped = residentData.map((item) => ({
          quarter: `${Math.floor(item.quarter / 10)}년 ${
            item.quarter % 10
          }분기`,
          population: item.population,
        }));

        const labels = quarterOrder;
        const workingCounts = labels.map((label) => {
          const item = workingMapped.find((d) => d.quarter === label);
          return item ? item.population : 0;
        });
        const residentCounts = labels.map((label) => {
          const item = residentMapped.find((d) => d.quarter === label);
          return item ? item.population : 0;
        });
        setCount([workingCounts[4], residentCounts[4]]);

        if (chart) {
          chart.destroy();
        }

        if (chartRef.current) {
          const ctx = chartRef.current.getContext("2d");
          const newChart = new Chart(ctx, {
            type: "bar",
            data: {
              // labels: labels,
              labels: ["2024년 1분기"],
              datasets: [
                {
                  label: "직장 유동 인구수",
                  data: [workingCounts[4]],
                  tension: 0.2,
                  backgroundColor: "rgba(54, 162, 235, 0.2)", // 파란색 배경
                  borderColor: "rgba(54, 162, 235, 1)", // 파란색 경계
                  borderWidth: 1,
                  fill: false,
                },
                {
                  label: "주거 유동 인구수",
                  data: [residentCounts[4]],
                  tension: 0.2,
                  backgroundColor: "rgba(255, 159, 64, 0.2)", // 주황색 배경
                  borderColor: "rgba(255, 159, 64, 1)", // 주황색 경계
                  borderWidth: 1,
                  fill: false,
                },
              ],
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          });
          setChart(newChart);
        }
      } catch (error) {
        console.error("Failed to fetch area data", error);
      }
    };

    if (chartRef.current) {
      fetchData();
    }
  }, [code]);

  return (
    <div style={{ margin: "40px" }}>
      <canvas ref={chartRef}></canvas>
      <div style={{ textAlign: "center" }}>
        <h5>
          직장인구 수:{" "}
          <strong className="text-primary">{count[0]?.toLocaleString()}</strong>
          명, 주거인구 수:{" "}
          <strong className="text-primary">{count[1]?.toLocaleString()}</strong>
          명
        </h5>
      </div>
    </div>
  );
};

export default PopulationMulti;
