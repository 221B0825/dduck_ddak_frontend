import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

const IndustrySalesCategory = ({ code, category }) => {
  const chartRef = useRef(null);
  const [chart, setChart] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.gadduck.info/towns/industry/sales/transition?code=${code}&industryName=${category}`
        );

        const salesData = response.data.data.salesList;

        // 분기 순서를 정의
        const quarterOrder = [
          "2023년 1분기",
          "2023년 2분기",
          "2023년 3분기",
          "2023년 4분기",
          "2024년 1분기",
        ];

        // 가장 최근 두 분기의 데이터를 가져옴
        const last = salesData[salesData.length - 1].salesOfTown;
        const secondLast = salesData[salesData.length - 2].salesOfTown;

        // 감소 여부를 확인
        if (last < secondLast) {
          setComment("감소 중");
        } else {
          setComment("증가 중 또는 안정");
        }

        // 데이터를 분기 순서에 맞게 매핑
        const salesOfTown = quarterOrder.map((q) => {
          const record = salesData.find(
            (item) =>
              `${Math.floor(item.quarter / 10)}년 ${item.quarter % 10}분기` ===
              q
          );
          return record ? record.salesOfTown : null;
        });

        const salesAvgOfCity = quarterOrder.map((q) => {
          const record = salesData.find(
            (item) =>
              `${Math.floor(item.quarter / 10)}년 ${item.quarter % 10}분기` ===
              q
          );
          return record ? record.salesAvgOfCity : null;
        });

        const salesAvgOfDistrict = quarterOrder.map((q) => {
          const record = salesData.find(
            (item) =>
              `${Math.floor(item.quarter / 10)}년 ${item.quarter % 10}분기` ===
              q
          );
          return record ? record.salesAvgOfDistrict : null;
        });

        if (chart) {
          chart.destroy();
        }

        const ctx = chartRef.current.getContext("2d");
        const newChart = new Chart(ctx, {
          type: "line", // 차트 유형을 선 차트로 변경
          data: {
            labels: quarterOrder,
            datasets: [
              {
                label: `${salesData[0].townName}`,
                data: salesOfTown,
                backgroundColor: "rgba(54, 162, 235, 0.2)", // 파란색 배경
                borderColor: "rgba(54, 162, 235, 1)", // 파란색 경계
                fill: false,
              },
              {
                label: "자치구",
                data: salesAvgOfDistrict,
                borderColor: "rgba(255, 205, 86, 1)",
                backgroundColor: "rgba(255, 205, 86, 0.6)",
                fill: false,
              },
              {
                label: "서울시",
                data: salesAvgOfCity,
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
                  color: "black", // 여기서 범례 텍스트 색상을 검은색으로 설정
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
    <div style={{ margin: "40px" }}>
      {isEmpty ? <p>No data available.</p> : <canvas ref={chartRef}></canvas>}

      <br></br>
      <div style={{ textAlign: "center" }}>
        <h5>
          현재 동의 분기별 유동인구는 <br></br>전분기 대비{" "}
          <strong className="text-primary">{comment}</strong> 입니다.
        </h5>
      </div>
    </div>
  );
};

export default IndustrySalesCategory;
