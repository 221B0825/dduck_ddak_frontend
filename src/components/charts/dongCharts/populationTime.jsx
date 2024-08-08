import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

const PopulationTime = ({ code }) => {
  const chartRef = useRef(null);
  const [chart, setChart] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.gadduck.info/towns/populations/floating/time?code=${code}`
        );
        const timeData = response.data.data;

        // 데이터를 차트에 맞게 변환
        const labels = Object.keys(timeData).map((key) =>
          key.replace("hour_", "").replace("_", "~")
        );
        const values = Object.values(timeData);

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
                  label: "행정동 시간별 유동 인구수",
                  data: values,
                  borderColor: "rgb(255, 99, 71)", // 다홍색으로 설정
                  backgroundColor: "rgba(255, 99, 71, 0.2)", // 다홍색의 투명 배경
                  tension: 0.2,
                },
              ],
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 500000, // Y축 간격을 500,000으로 설정
                    callback: function (value, index, values) {
                      return value.toLocaleString(); // 값의 형식을 1,000 등의 형식으로 변경
                    },
                  },
                  suggestedMax: Math.max(...values) + 100000, // 가장 높은 값에 100,000을 더한 값을 최대값으로 제안
                },
              },
              plugins: {
                legend: {
                  display: true, // 범례 표시
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
  }, [code]); // code가 변경될 때마다 fetchData 실행

  return (
    <div style={{ margin: "40px" }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default PopulationTime;
