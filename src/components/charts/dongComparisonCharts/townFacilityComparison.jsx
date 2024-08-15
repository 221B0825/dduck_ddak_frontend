import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

const labels = {
  governmentOfficeCnt: "정부 기관 수",
  bankCnt: "은행 수",
  hospitalCnt: "병원 수",
  pharmacyCnt: "약국 수",
  departmentStore: "백화점 수",
  schoolCnt: "학교 수",
  accommodationFacilityCnt: "숙박 시설 수",
  transportationFacilityCnt: "교통 시설 수",
};

const findMaxFacility = (facilities) => {
  let maxCount = 0;
  let maxFacility = "";

  for (const [key, value] of Object.entries(facilities)) {
    if (value > maxCount) {
      maxCount = value;
      maxFacility = key;
    }
  }

  return { facility: labels[maxFacility], count: maxCount }; // 한글 레이블과 개수를 반환
};

const TownFacilityComparison = ({
  baseName,
  baseCode,
  selectName,
  selectCode,
}) => {
  const chartRef = useRef(null);
  const [chart, setChart] = useState(null);
  const [summaryBase, setSummaryBase] = useState("");
  const [summarySelect, setSummarySelect] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [response1, response2] = await Promise.all([
          axios.get(`https://api.gadduck.info/towns/facility?code=${baseCode}`),
          axios.get(
            `https://api.gadduck.info/towns/facility?code=${selectCode}`
          ),
        ]);

        const data1 = response1.data.data;
        const data2 = response2.data.data;

        const maxFacilityBase = findMaxFacility(data1);
        const maxFacilitySelect = findMaxFacility(data2);

        setSummaryBase(
          `${maxFacilityBase.facility} ${maxFacilityBase.count}개`
        );
        setSummarySelect(
          `${maxFacilitySelect.facility} ${maxFacilitySelect.count}개`
        );

        // 데이터를 차트에 맞게 변환
        const labelsArray = Object.values(labels);
        const counts1 = [
          data1.governmentOfficeCnt,
          data1.bankCnt,
          data1.hospitalCnt,
          data1.pharmacyCnt,
          data1.departmentStore,
          data1.schoolCnt,
          data1.accommodationFacilityCnt,
          data1.transportationFacilityCnt,
        ];
        const counts2 = [
          data2.governmentOfficeCnt,
          data2.bankCnt,
          data2.hospitalCnt,
          data2.pharmacyCnt,
          data2.departmentStore,
          data2.schoolCnt,
          data2.accommodationFacilityCnt,
          data2.transportationFacilityCnt,
        ];

        if (chart) {
          chart.destroy(); // 이전 차트가 있으면 파괴
        }

        if (chartRef.current) {
          const ctx = chartRef.current.getContext("2d");
          const newChart = new Chart(ctx, {
            type: "bar", // 차트의 유형
            data: {
              labels: labelsArray,
              datasets: [
                {
                  label: baseName,
                  data: counts1,
                  backgroundColor: "rgba(54, 162, 235, 0.2)", // 파란색 배경
                  borderColor: "rgba(54, 162, 235, 1)", // 파란색 경계
                  borderWidth: 1,
                },
                {
                  label: selectName,
                  data: counts2,
                  backgroundColor: "rgba(255, 99, 132, 0.2)", // 다홍색 배경
                  borderColor: "rgba(255, 99, 132, 1)", // 다홍색 경계
                  borderWidth: 1,
                },
              ],
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1, // Y축 값의 스텝을 1로 설정
                  },
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

    fetchData();
  }, [baseCode, selectCode]); // code가 변경될 때마다 fetchData 실행

  return (
    <div style={{ margin: "40px" }}>
      <canvas ref={chartRef}></canvas>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h5
          className="m-2"
          style={{
            border: "1px solid #D9D9D9",
            borderRadius: "5px",
            padding: "10px",
          }}
        >
          가장 많은 집객시설 개수
        </h5>
        <h5>
          {`${baseName} : `}
          <strong className="text-primary">{summaryBase}</strong>
        </h5>
        <h5>
          {`${selectName} : `}
          <strong className="text-primary">{summarySelect}</strong>
        </h5>
      </div>
    </div>
  );
};

export default TownFacilityComparison;
