import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

const SalesTime = ({ code }) => {
  const chartRef = useRef(null);
  const [chart, setChart] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.gadduck.info/towns/sales/time?code=${code}`
        );
        const timeData = response.data.data;

        // 데이터를 차트에 맞게 변환
        const labels = Object.keys(timeData).map((key) =>
          key.replace("hour_", "").replace("_", "-")
        );
        const values = Object.values(timeData);

        if (chart) {
          chart.destroy(); // 이전 차트가 있으면 파괴
        }

        const ctx = chartRef.current.getContext("2d");
        const newChart = new Chart(ctx, {
          
          data: {
            labels: labels,
            datasets: [
              {
                type: "line",
                data: values,
                backgroundColor: "rgba(75, 192, 192, 0.5)",
                borderColor: "rgb(75, 192, 192)",
                borderWidth: 1,
              }, {
                type: "bar",
                data: values
              }
            ],
          },
          options: {
            scales: {},
            plugins: {
              legend: {
                display: false, // 범례 표시
              },
              title: {
                display: true,
                text: "행정동 시간별 매출", // 차트 타이틀
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

export default SalesTime;
