import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

const IndustrySalesComparison = ({
  baseCode,
  baseName,
  selectCode,
  selectName,
  category,
}) => {
  const chartRef = useRef(null);
  const [chart, setChart] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [commentBase, setCommentBase] = useState("");
  const [commentSelect, setCommentSelect] = useState("");

  const labels = {
    hour_0_6: "00시~06시",
    hour_6_11: "06시~11시",
    hour_11_14: "11시~14시",
    hour_14_17: "14시~17시",
    hour_17_21: "17시~21시",
    hour_21_24: "21시~24시",
  };

  const findMaxAges = (ages) => {
    let maxCount = 0;
    let maxAges = "";

    for (const [key, value] of Object.entries(ages)) {
      if (value > maxCount) {
        maxCount = value;
        maxAges = key;
      }
    }

    return labels[maxAges]; // 한글 레이블 반환
  };

  //같은 업종 매출 비교
  useEffect(() => {
    const fetchData = async () => {
      let salesData1;
      let salesData2;
      let labels;

      try {
        if (category === "전체") {
          const [response1, response2] = await Promise.all([
            axios.get(
              `https://api.gadduck.info/towns/sales/time?code=${baseCode}`
            ),
            axios.get(
              `https://api.gadduck.info/towns/sales/time?code=${selectCode}`
            ),
          ]);

          salesData1 = response1.data.data;
          salesData2 = response2.data.data;
          labels = Object.keys(salesData1).map((key) =>
            key.replace("hour_", "").replace("_", "~")
          );

          setCommentBase(findMaxAges(salesData1));
          setCommentSelect(findMaxAges(salesData2));
        } else {
          const [response1, response2] = await Promise.all([
            axios.get(
              `https://api.gadduck.info/towns/industry/sales?code=${baseCode}&name=${category}`
            ),
            axios.get(
              `https://api.gadduck.info/towns/industry/sales?code=${selectCode}&name=${category}`
            ),
          ]);

          salesData1 = response1.data.data;
          salesData2 = response2.data.data;
          labels = [
            "월요일",
            "화요일",
            "수요일",
            "목요일",
            "금요일",
            "토요일",
            "일요일",
          ];
        }

        const counts1 = Object.values(salesData1);
        const counts2 = Object.values(salesData2);

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
                label: baseName,
                data: counts1,
                backgroundColor: "rgba(54, 162, 235, 0.6)", // 파란색 배경
                borderColor: "rgba(54, 162, 235, 1)", // 파란색 경계
                borderWidth: 1,
              },
              {
                label: selectName,
                data: counts2,
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
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
        setIsEmpty(false);
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
        <h6>각 행정동 별 최대 매출 시간대</h6>
        <h5>
          {baseName}: <strong className="text-primary">{commentBase}</strong>
        </h5>
        <h5>
          {selectName}:{" "}
          <strong className="text-primary">{commentSelect}</strong>
        </h5>
      </div>
    </div>
  );
};

export default IndustrySalesComparison;
