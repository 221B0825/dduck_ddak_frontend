import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

const SalesTime = ({ code, setSummary }) => {
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

        let maxPopulation = 0;
        let summary = "";
        for (const [key, value] of Object.entries(timeData)) {
          if (value > maxPopulation) {
            maxPopulation = value;
            summary = key;
          }
        }
        // setSummary(`${formatTimeRange(summary)}`)

        if (chart) {
          chart.destroy(); // 이전 차트가 있으면 파괴
        }

        if (chartRef.current) {
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
                },
                {
                  type: "bar",
                  data: values,
                },
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

function formatTimeRange(key) {
  // 키 값에서 숫자만 추출하여 시간 범위 배열로 저장
  const times = key.match(/\d+/g).map(Number); // ['0', '6'] -> [0, 6]

  // 시간 포맷을 '00시~06시까지' 형태로 변경
  return `${times[0].toString().padStart(2, "0")}시~${times[1]
    .toString()
    .padStart(2, "0")}시까지`;
}

export default SalesTime;
