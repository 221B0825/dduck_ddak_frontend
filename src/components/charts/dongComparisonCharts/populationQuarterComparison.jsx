import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

const PopulationQuarterComparison = ({
  name1,
  code1,
  name2,
  code2,
  setSummary,
}) => {
  const chartRef = useRef(null);
  const [chart, setChart] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await axios.get(
          `https://api.gadduck.info/towns/populations/floating/quarter?code=${code1}`
        );

        const response2 = await axios.get(
          `https://api.gadduck.info/towns/populations/floating/quarter?code=${code2}`
        );

        const populationList1 = response1.data.data.populationList;
        const populationList2 = response2.data.data.populationList;

        // 데이터를 차트에 맞게 변환
        const labels = populationList1.map(
          (item) =>
            `${Math.floor(item.quarter / 10)}년 ${item.quarter % 10}분기`
        );
        const values1 = populationList1.map((item) => item.population);
        const values2 = populationList2.map((item) => item.population);

        // 2024년 1분기 데이터 비교를 위한 요약 정보 설정
        const firstQuarter2024_1 =
          populationList1.find((item) => item.quarter === 20241)?.population ||
          0;
        const firstQuarter2024_2 =
          populationList2.find((item) => item.quarter === 20241)?.population ||
          0;
        const summaryText =
          firstQuarter2024_1 > firstQuarter2024_2
            ? `2024년 1분기에 ${name1} 동의 인구가 ${name2} 동보다 많습니다.`
            : `2024년 1분기에 ${name2} 동의 인구가 ${name1} 동보다 많습니다.`;

        // setSummary(summaryText);

        if (chartRef.current) {
          const ctx = chartRef.current.getContext("2d");
          if (chart) chart.destroy(); // 기존 차트 제거

          const newChart = new Chart(ctx, {
            type: "line",
            data: {
              labels,
              datasets: [
                {
                  label: `${name1.replace("서울특별시 ", "")}`,
                  data: values1,
                  borderColor: "rgb(255, 99, 132)",
                  backgroundColor: "rgba(255, 99, 132, 0.5)",
                },
                {
                  label: `${name2.replace("서울특별시 ", "")}`,
                  data: values2,
                  borderColor: "rgb(54, 162, 235)",
                  backgroundColor: "rgba(54, 162, 235, 0.5)",
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

    fetchData();
  }, [code1, code2, setSummary]);

  return (
    <div style={{ margin: "40px" }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default PopulationQuarterComparison;
