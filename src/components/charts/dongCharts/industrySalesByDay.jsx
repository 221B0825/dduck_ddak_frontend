import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

const IndustrySales = ({ code, category, setSummaryStore }) => {
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
        const labels = [
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
            labels: labels,
            datasets: [
              {
                label: `일자별 매출`,
                data: counts,
              },
            ],
          },
          options: {
            plugins: {
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
