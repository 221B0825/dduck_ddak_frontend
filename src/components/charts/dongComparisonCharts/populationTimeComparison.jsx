import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

const PopulationTimeComparison = ({
  baseName,
  baseCode,
  selectName,
  selectCode,
  category,
}) => {
  const chartRef = useRef(null);
  const [chart, setChart] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [response1, response2] = await Promise.all([
          axios.get(
            `https://api.gadduck.info/towns/populations/floating/time?code=${baseCode}`
          ),
          axios.get(
            `https://api.gadduck.info/towns/populations/floating/time?code=${selectCode}`
          ),
        ]);

        const data1 = Object.values(response1.data.data);
        const data2 = Object.values(response2.data.data);

        const labels = Object.keys(response1.data.data).map((key) =>
          key.replace("hour_", "").replace("_", "~")
        );

        if (chart) {
          chart.destroy(); // 이전 차트가 있으면 파괴
        }

        if (chartRef.current) {
          const ctx = chartRef.current.getContext("2d");
          const newChart = new Chart(ctx, {
            type: "line",
            data: {
              labels: labels,
              datasets: [
                {
                  label: baseName,
                  data: data1,
                  backgroundColor: "rgba(255, 99, 71, 0.6)", // 다홍색 배경
                  borderColor: "rgba(255, 99, 71, 1)", // 다홍색 경계
                  borderWidth: 1,
                },
                {
                  label: selectName,
                  data: data2,
                  backgroundColor: "rgba(54, 162, 235, 0.6)", // 파란색 배경
                  borderColor: "rgba(54, 162, 235, 1)", // 파란색 경계
                  borderWidth: 1,
                },
              ],
            },
            options: {
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: `행정동 별 유동인구 수 비교`,
                },
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
          setIsEmpty(false);
        }
      } catch (error) {
        console.error("Failed to fetch area data", error);
        setIsEmpty(true);
      }
    };

    if (chartRef.current) {
      fetchData();
    }
  }, [baseCode, selectCode, category]);

  return (
    <div style={{ margin: "40px" }}>
      {isEmpty ? (
        <p>No data available for {category} in these regions.</p>
      ) : (
        <canvas ref={chartRef}></canvas>
      )}
    </div>
  );
};

export default PopulationTimeComparison;
