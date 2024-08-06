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
          `https://api.gadduck.info/towns/populations/floating/quarter?code=${code}`
        );
        const populationList = response.data.data.populationList;

        // 데이터를 차트에 맞게 변환
        const labels = populationList.map((item) => {
          const year = Math.floor(item.quarter / 10);
          const quarter = item.quarter % 10;
          return `${year}년 ${quarter}분기`;
        });
        const values = populationList.map((item) => item.population);

        if (chart) {
          chart.destroy(); // 이전 차트가 있으면 파괴
        }

        const ctx = chartRef.current.getContext("2d");
        const newChart = new Chart(ctx, {
          type: "line", // 차트의 유형
          data: {
            labels: labels,
            datasets: [
              {
                label: "행정동 분기별 유동 인구수",
                data: values,
                tension: 0.2,
            
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              
            }
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
