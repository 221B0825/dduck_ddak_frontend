import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

const FloatingQuarter = ({ code }) => {
  // 분기별 유동인구 순위
  const [summaryRank, setSummaryRank] = useState([]);
  const chartRef = useRef(null);
  const [chart, setChart] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.gadduck.info/towns/populations/floating/transition?code=${code}`
        );

        const floatingData = response.data.data.populationList;
        const quarterOrder = [
          "2023년 1분기",
          "2023년 2분기",
          "2023년 3분기",
          "2023년 4분기",
          "2024년 1분기",
        ];

        const populationOfTown = quarterOrder.map((q) => {
          const record = floatingData.find(
            (item) =>
              `${Math.floor(item.quarter / 10)}년 ${item.quarter % 10}분기` ===
              q
          );
          return record ? record.populationOfTown : null;
        });

        const populationAvgOfCity = quarterOrder.map((q) => {
          const record = floatingData.find(
            (item) =>
              `${Math.floor(item.quarter / 10)}년 ${item.quarter % 10}분기` ===
              q
          );
          return record ? record.populationAvgOfCity : null;
        });

        const populationAvgOfDistrict = quarterOrder.map((q) => {
          const record = floatingData.find(
            (item) =>
              `${Math.floor(item.quarter / 10)}년 ${item.quarter % 10}분기` ===
              q
          );
          return record ? record.populationAvgOfDistrict : null;
        });
        // 구 내 순위, 자치구 내의 동 개수, 서울시 순위, 서울시 동 개수
        let rankingList = [
          floatingData[4].rankAtDistrict,
          response.data.data.districtCount,
          floatingData[4].rankAtCity,
          426,
        ];
        setSummaryRank(rankingList);

        if (chart) {
          chart.destroy();
        }

        const ctx = chartRef.current.getContext("2d");
        const newChart = new Chart(ctx, {
          type: "line",
          data: {
            labels: quarterOrder,
            datasets: [
              {
                label: `${floatingData[0].townName}`,
                data: populationOfTown,
                backgroundColor: "rgba(54, 162, 235, 0.2)", // 파란색 배경
                borderColor: "rgba(54, 162, 235, 1)", // 파란색 경계
                fill: false,
              },
              {
                label: "자치구",
                data: populationAvgOfDistrict,
                borderColor: "rgba(255, 205, 86, 1)",
                backgroundColor: "rgba(255, 205, 86, 0.6)",
                fill: false,
              },
              {
                label: "서울시",
                data: populationAvgOfCity,
                borderColor: "rgba(92,92,92, 1)",
                backgroundColor: "#838383",
                fill: false,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
            plugins: {
              legend: {
                labels: {
                  color: "black",
                },
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
  }, [code, chartRef, isEmpty]);

  return (
    <div style={{ margin: "0 40px 40px 40px" }}>
      {isEmpty ? (
        <p>No data available.</p>
      ) : (
        <>
          <div
            className=""
            style={{
              border: "1px solid #D9D9D9",
              borderRadius: "5px",
              margin: "5px",
              padding: "5px",
              textAlign: "left",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            자치구 내 순위:
            <span style={{ fontWeight: "bold", color: "#3065FA" }}>
              {summaryRank[0]}{" "}
            </span>{" "}
            / {summaryRank[1]} 서울시 내 순위:
            <span style={{ fontWeight: "bold", color: "#3065FA" }}>
              {" "}
              {summaryRank[2]}
            </span>{" "}
            / {summaryRank[3]}
          </div>

          <canvas ref={chartRef}></canvas>
        </>
      )}
    </div>
  );
};

export default FloatingQuarter;
