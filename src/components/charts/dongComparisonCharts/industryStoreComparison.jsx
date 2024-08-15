import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

const IndustryStoreComparison = ({
  baseName,
  baseCode,
  selectName,
  selectCode,
  category,
}) => {
  const chartRef = useRef(null);
  const [chart, setChart] = useState(null);
  const [commentBase, setCommentBase] = useState("");
  const [commentSelect, setCommentSelect] = useState("");
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 두 개의 동에 대해 최근 데이터 가져오기
        const [recentlyResponse1, recentlyResponse2] = await Promise.all([
          axios.get(
            `https://api.gadduck.info/towns/industry/recently?code=${baseCode}&name=${category}`
          ),
          axios.get(
            `https://api.gadduck.info/towns/industry/recently?code=${selectCode}&name=${category}`
          ),
        ]);

        const recentlyData1 = recentlyResponse1.data.data;
        const recentlyData2 = recentlyResponse2.data.data;

        // 2024년 1분기 데이터만 추출
        const quarterLabel = "2024년 1분기";
        const lastData1 = recentlyData1.find(
          (item) =>
            `${Math.floor(item.quarter / 10)}년 ${item.quarter % 10}분기` ===
            quarterLabel
        );
        const lastData2 = recentlyData2.find(
          (item) =>
            `${Math.floor(item.quarter / 10)}년 ${item.quarter % 10}분기` ===
            quarterLabel
        );

        const countBase = lastData1 ? lastData1.count : 0;
        const countSelect = lastData2 ? lastData2.count : 0;

        setCommentBase(countBase);
        setCommentSelect(countSelect);

        if (chart) {
          chart.destroy();
        }

        const ctx = chartRef.current.getContext("2d");
        const newChart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: [quarterLabel],
            datasets: [
              {
                label: baseName,
                data: [countBase],
                backgroundColor: "rgba(54, 162, 235, 0.6)", // 파란색 배경
                borderColor: "rgba(54, 162, 235, 1)", // 파란색 경계
                borderWidth: 1,
              },
              {
                label: selectName,
                data: [countSelect],
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1,
                },
              },
            },
            plugins: {
              legend: {
                display: true,
              },
            },
          },
        });
        setChart(newChart);
      } catch (error) {
        console.error("Failed to fetch area data", error);
        setIsEmpty(true);
      }
    };

    fetchData();
  }, [baseCode, selectCode, category]);

  return (
    <div style={{ margin: "40px" }}>
      {isEmpty ? (
        <p>No data available for {category} in these regions.</p>
      ) : (
        <canvas ref={chartRef}></canvas>
      )}
      <div style={{ textAlign: "center" }}>
        <h5
          className="m-2"
          style={{
            border: "1px solid #D9D9D9",
            borderRadius: "5px",
            padding: "10px",
          }}
        >{`2024년 1분기 점포수`}</h5>
        <h5>
          {`${baseName} : `}
          <strong className="text-primary">{commentBase}</strong>
        </h5>
        <h5>
          {`${selectName} : `}
          <strong className="text-primary">{commentSelect}</strong>
        </h5>
      </div>
    </div>
  );
};

export default IndustryStoreComparison;
