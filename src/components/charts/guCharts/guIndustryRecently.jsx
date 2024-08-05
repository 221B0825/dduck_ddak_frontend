import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

const GuIndustryRecently = ({ code, category }) => {
  const chartRef = useRef(null);
  const [chart, setChart] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://gadduck.info/towns/industry/recently-district?district=${code}&name=${category}`
        );
        const data = response.data.data;

        // 데이터를 차트에 맞게 변환

         // 데이터를 차트에 맞게 변환
         const labels = data.map((item) => {
          const year = Math.floor(item.quarter / 10);
          const quarter = item.quarter % 10;
          return `${year}년 ${quarter}분기`;
        });
        const counts = data.map((item) => item.count); // 카운트 데이터

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
                label: "구별 점포 수 추이",
                data: counts,
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

export default GuIndustryRecently;
