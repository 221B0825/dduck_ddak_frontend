import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

const IndustrySalesComparison = ({ code1, code2, category, setSummary }) => {
  const chartRef = useRef(null);
  const [chart, setChart] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);

  //같은 업종 매출 비교
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [response1, response2] = await Promise.all([
          axios.get(
            `https://api.gadduck.info/towns/industry/sales?code=${code1}&name=${category}`
          ),
          axios.get(
            `https://api.gadduck.info/towns/industry/sales?code=${code2}&name=${category}`
          ),
        ]);

        const salesData1 = response1.data.data;
        const salesData2 = response2.data.data;

        console.log(salesData1);
        console.log(salesData2);
        setSummary(`${code}`);

        if (
          !salesData1 ||
          Object.keys(salesData1).length === 0 ||
          !salesData2 ||
          Object.keys(salesData2).length === 0
        ) {
          setIsEmpty(true);
          return;
        }

        setIsEmpty(false);

        const originalLabels = [
          "월요일",
          "화요일",
          "수요일",
          "목요일",
          "금요일",
          "토요일",
          "일요일",
        ];
        const labels = [
          "월요일",
          "화요일",
          "수요일",
          "목요일",
          "금요일",
          "토요일",
          "일요일",
        ];

        const reorderData = (data) => {
          const reordered = [];
          for (const label of labels) {
            const index = originalLabels.indexOf(label);
            reordered.push(data[index]);
          }
          return reordered;
        };

        const counts1 = reorderData(
          Object.values(salesData1).map((count) => parseFloat(count))
        );
        const counts2 = reorderData(
          Object.values(salesData2).map((count) => parseFloat(count))
        );

        if (chart) {
          chart.destroy();
        }

        const ctx = chartRef.current.getContext("2d");
        const newChart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: labels,
            datasets: [
              {
                label: `${code1}`,
                data: counts1,
                backgroundColor: "rgba(255, 99, 71, 0.6)", // 다홍색 배경
                borderColor: "rgba(255, 99, 71, 1)", // 다홍색 경계
                borderWidth: 1,
              },
              {
                label: `${code2}`,
                data: counts2,
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
                text: `행정동 별 ${category} 매출 비교`,
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
      } catch (error) {
        console.error("Failed to fetch area data", error);
      }
    };

    fetchData();
  }, [code1, code2, category]);

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

export default IndustrySalesComparison;
