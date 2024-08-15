import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

const PopulationTimeComparison = ({
  baseName,
  baseCode,
  selectName,
  selectCode,
}) => {
  const chartRef = useRef(null);
  const [chart, setChart] = useState(null);
  const [commentBase, setCommentBase] = useState("");
  const [commentSelect, setCommentSelect] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [response1, response2] = await Promise.all([
          axios.get(
            `https://api.gadduck.info/towns/populations/floating/time?code=${baseCode}`
          ),
          axios.get(
            `https://api.gadduck.info/towns/populations/floating/time?code=${selectCode}`
          ),
        ]);

        const timeData1 = response1.data.data;
        const timeData2 = response2.data.data;

        // 데이터를 차트에 맞게 변환
        const labels = Object.keys(timeData1).map((key) =>
          key.replace("hour_", "").replace("_", "~")
        );
        const values1 = Object.values(timeData1);
        const values2 = Object.values(timeData2);

        let maxPopulation1 = 0;
        let maxPopulation2 = 0;

        for (const [key, value] of Object.entries(timeData1)) {
          if (value > maxPopulation1) {
            maxPopulation1 = value;
            setCommentBase(formatTimeRange(key));
          }
        }

        for (const [key, value] of Object.entries(timeData2)) {
          if (value > maxPopulation2) {
            maxPopulation2 = value;
            setCommentSelect(formatTimeRange(key));
          }
        }

        if (chart) {
          chart.destroy(); // 이전 차트가 있으면 파괴
        }

        if (chartRef.current) {
          const ctx = chartRef.current.getContext("2d");
          const newChart = new Chart(ctx, {
            type: "line",
            data: {
              labels: labels,
              datasets: [
                {
                  label: baseName,
                  data: values1,
                  borderColor: "rgb(54, 162, 235)", // 파란색으로 설정
                  backgroundColor: "rgba(54, 162, 235, 0.2)", // 파란색의 투명 배경
                  tension: 0.2,
                },
                {
                  label: selectName,
                  data: values2,
                  borderColor: "rgb(255, 99, 71)", // 다홍색으로 설정
                  backgroundColor: "rgba(255, 99, 71, 0.2)", // 다홍색의 투명 배경
                  tension: 0.2,
                },
              ],
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 500000, // Y축 간격을 500,000으로 설정
                    callback: function (value, index, values) {
                      return value.toLocaleString(); // 값의 형식을 1,000 등의 형식으로 변경
                    },
                  },
                  suggestedMax: Math.max(...values1.concat(values2)) + 100000, // 두 데이터 중 가장 높은 값에 100,000을 더한 값을 최대값으로 제안
                },
              },
              plugins: {
                legend: {
                  display: true, // 범례 표시
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
  }, [baseCode, selectCode]); // code가 변경될 때마다 fetchData 실행

  return (
    <div style={{ margin: "40px" }}>
      <canvas ref={chartRef}></canvas>
      <div style={{ textAlign: "center" }}>
        <h6 className="m-3">{`유동인구가 가장 많은 시간대`}</h6>
        <h6 className="m-3">
          {`${baseName} : `}
          <strong className="text-primary">{commentBase}</strong>
        </h6>
        <h6 className="m-3">
          {`${selectName} : `}
          <strong className="text-primary">{commentSelect}</strong>
        </h6>
      </div>
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

export default PopulationTimeComparison;
