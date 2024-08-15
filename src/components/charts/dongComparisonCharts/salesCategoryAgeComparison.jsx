import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

const SalesCategoryAgeComparison = ({
  baseCode,
  baseName,
  selectCode,
  selectName,
  category,
}) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [commentBase, setCommentBase] = useState("");
  const [commentSelect, setCommentSelect] = useState("");

  const labels = {
    age10sSales: "10대",
    age20sSales: "20대",
    age30sSales: "30대",
    age40sSales: "40대",
    age50sSales: "50대",
    age60sSales: "60대 이상",
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

    return [labels[maxAges]]; // 한글 레이블 반환
  };

  const fetchData = async () => {
    try {
      const [response1, response2] = await Promise.all([
        axios.get(
          `https://api.gadduck.info/towns/industry/sales/age-rate?code=${baseCode}&industryName=${category}`
        ),
        axios.get(
          `https://api.gadduck.info/towns/industry/sales/age-rate?code=${selectCode}&industryName=${category}`
        ),
      ]);

      const data1 = {
        age10sSales: response1.data.data.age10sSales,
        age20sSales: response1.data.data.age20sSales,
        age30sSales: response1.data.data.age30sSales,
        age40sSales: response1.data.data.age40sSales,
        age50sSales: response1.data.data.age50sSales,
        age60sSales: response1.data.data.age60sAndMoreSales,
      };

      const data2 = {
        age10sSales: response2.data.data.age10sSales,
        age20sSales: response2.data.data.age20sSales,
        age30sSales: response2.data.data.age30sSales,
        age40sSales: response2.data.data.age40sSales,
        age50sSales: response2.data.data.age50sSales,
        age60sSales: response2.data.data.age60sAndMoreSales,
      };

      setChartData({ data1, data2 });
      setCommentBase(findMaxAges(data1));
      setCommentSelect(findMaxAges(data2));
      setIsEmpty(false);
    } catch (error) {
      console.error("Failed to fetch area data", error);
      setIsEmpty(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, [baseCode, selectCode, category]);

  useEffect(() => {
    if (chartData && chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      const newChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: Object.values(labels),
          datasets: [
            {
              label: `${baseName} 연령대별 매출`,
              data: Object.values(chartData.data1),
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
            {
              label: `${selectName} 연령대별 매출`,
              data: Object.values(chartData.data2),
              backgroundColor: "rgba(255, 99, 132, 0.6)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
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
              display: true,
            },
          },
        },
      });

      return () => newChart.destroy();
    }
  }, [chartData]);

  return (
    <div style={{ margin: "40px" }}>
      {isEmpty ? (
        <p>No data available for {category} in these regions.</p>
      ) : (
        <canvas ref={chartRef} />
      )}
      <div style={{ textAlign: "center" }}>
        <h5 className="m-3">{`각 동별 매출이 가장 많은 연령대`}</h5>
        <h5 className="m-3">
          {`${baseName} : `}
          <strong className="text-primary">{commentBase}</strong>
        </h5>
        <h5 className="m-3">
          {`${selectName} : `}
          <strong className="text-primary">{commentSelect}</strong>
        </h5>
      </div>
    </div>
  );
};

export default SalesCategoryAgeComparison;
