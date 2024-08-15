import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

const IndustrySales = ({ code, category }) => {
  const chartRef = useRef(null);
  const [chart, setChart] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false); // 데이터 유무 상태 추가
  const [comment, setComment] = useState("");

  const labels = {
    monday: "월요일",
    tuesday: "화요일",
    wednesday: "수요일",
    thursday: "목요일",
    friday: "금요일",
    saturday: "토요일",
    sunday: "일요일",
  };

  const findMaxSales = (sales) => {
    let maxCount = 0;
    let maxSales = "";

    for (const [key, value] of Object.entries(sales)) {
      if (value > maxCount) {
        maxCount = value;
        maxSales = key;
      }
    }

    return labels[maxSales]; // 한글 레이블 반환
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.gadduck.info/towns/industry/sales?code=${code}&name=${category}`
        );
        const salesData = response.data.data;
        setComment(findMaxSales(salesData));

        if (!salesData || Object.keys(salesData).length === 0) {
          setIsEmpty(true); // 데이터가 없다면 isEmpty를 true로 설정
          return; // 데이터가 없으면 여기서 함수 종료
        }

        setIsEmpty(false); // 데이터가 있으면 isEmpty를 false로 설정

        // 데이터를 차트에 맞게 변환
        const labelsArray = [
          "월요일",
          "화요일",
          "수요일",
          "목요일",
          "금요일",
          "토요일",
          "일요일",
        ];
        const counts = Object.values(salesData).map((count) =>
          parseFloat(count)
        );

        if (chart) {
          chart.destroy();
        }

        const ctx = chartRef.current.getContext("2d");
        const newChart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: labelsArray,
            datasets: [
              {
                label: `일자별 매출`,
                data: counts,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.6)", // 월요일 - 빨간색
                  "rgba(54, 162, 235, 0.6)", // 화요일 - 파란색
                  "rgba(255, 206, 86, 0.6)", // 수요일 - 노란색
                  "rgba(75, 192, 192, 0.6)", // 목요일 - 청록색
                  "rgba(153, 102, 255, 0.6)", // 금요일 - 보라색
                  "rgba(255, 159, 64, 0.6)", // 토요일 - 주황색
                  "rgba(255, 35, 35, 0.6)", // 일요일 - 녹색
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(153, 102, 255, 1)",
                  "rgba(255, 159, 64, 1)",
                  "rgba(244, 0, 0, 0.6)",
                ],
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
              title: {
                display: true,
                text: `행정동 별 ${category} 매출 추이`,
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
  }, [code, category]);

  return (
    <div style={{ margin: "40px" }}>
      {isEmpty ? (
        <p>No data available for {category} in this region.</p>
      ) : (
        <canvas ref={chartRef}></canvas>
      )}
      <div style={{ textAlign: "center" }}>
        <h5>
          현재 동의 요일별 매출이 <br></br> 가장 많을 때는{" "}
          <strong className="text-primary">{comment}</strong> 입니다.
        </h5>
      </div>
    </div>
  );
};

export default IndustrySales;
