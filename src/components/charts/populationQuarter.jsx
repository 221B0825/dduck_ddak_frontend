import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

const PopulationQuarter = ({ code }) => {
  const chartRef = useRef(null);
  const [chart, setChart] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://gadduck.info/towns/populations/floating/quarter?code=${code}`
        );
        const populationList = response.data.data.populationList;

        // 데이터를 차트에 맞게 변환
        const labels = populationList.map((item) => item.quarter.toString());
        const values = populationList.map((item) => item.population);

        if (chart) {
          chart.destroy(); // 이전 차트가 있으면 파괴
        }

        const ctx = chartRef.current.getContext("2d");
        const newChart = new Chart(ctx, {
          type: "bar", // 차트의 유형
          data: {
            labels: labels,
            datasets: [
              {
                label: "Population over Quarters",
                data: values,
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1,
                borderWidth: 0,
              },
            ],
          },
          options: {
            scales: {
              y: {
                // Y 축의 ID는 'y'로 설정
                beginAtZero: true,
                ticks: {
                  stepSize: 2000000, // Y축 간격을 500,000으로 설정
                  // 추가: 최대 값 설정을 위한 논리적 추정
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
      } catch (error) {
        console.error("Failed to fetch area data", error);
      }
    };

    fetchData();
  }, [code]); // code가 변경될 때마다 fetchData 실행

  return (
    <div style={{ margin: "40px" }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default PopulationQuarter;
