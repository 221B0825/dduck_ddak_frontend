import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

const SalesCategoryGenderComparison = ({
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

  const findMaxArea = (baseArea, SelectArea) => {
    let maxCount = 0;
    let maxArea1 = "";
    let maxArea2 = "";

    for (const [key, value] of Object.entries(baseArea)) {
      if (value > maxCount) {
        maxCount = value;
        maxArea1 = baseName;
      }
    }

    maxCount = 0;
    for (const [key, value] of Object.entries(SelectArea)) {
      if (value > maxCount) {
        maxCount = value;
        maxArea2 = selectName;
      }
    }

    return [maxArea1, maxArea2];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [baseResponse, selectResponse] = await Promise.all([
          axios.get(
            `https://api.gadduck.info/towns/industry/sales/gender-rate?code=${baseCode}&industryName=${category}`
          ),
          axios.get(
            `https://api.gadduck.info/towns/industry/sales/gender-rate?code=${selectCode}&industryName=${category}`
          ),
        ]);

        const baseData = {
          menPercentage: baseResponse.data.data.menPercentage,
          womenPercentage: baseResponse.data.data.womenPercentage,
          salesOfIndustry: baseResponse.data.data.salesOfIndustry,
        };

        const selectData = {
          menPercentage: selectResponse.data.data.menPercentage,
          womenPercentage: selectResponse.data.data.womenPercentage,
          salesOfIndustry: selectResponse.data.data.salesOfIndustry,
        };

        setChartData({ baseData, selectData });
        const commentData = findMaxArea(baseData, selectData);
        setCommentBase(commentData[0]);
        setCommentSelect(commentData[1]);
        setIsEmpty(false);
      } catch (error) {
        console.error("Failed to fetch area data", error);
        setIsEmpty(true);
      }
    };

    fetchData();
  }, [baseCode, selectCode, category]);

  useEffect(() => {
    if (chartData && chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      const newChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["남성 매출 비율", "여성 매출 비율"],
          datasets: [
            {
              label: `${baseName}`,
              data: [
                chartData.baseData.menPercentage,
                chartData.baseData.womenPercentage,
              ],
              borderColor: "rgba(75, 192, 192, 0.6)",
              backgroundColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
            {
              label: `${selectName}`,
              data: [
                chartData.selectData.menPercentage,
                chartData.selectData.womenPercentage,
              ],
              backgroundColor: "rgba(255, 206, 86, 0.6)",
              borderColor: "rgba(255, 206, 86, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "top",
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
        <h5 className="m-3">{`각 성별의 더 많은 매출을 가진 행정동`}</h5>
        <h5 className="m-3">
          {`남성 : `}
          <strong className="text-primary">{commentBase}</strong>
        </h5>
        <h5 className="m-3">
          {`여성 : `}
          <strong className="text-primary">{commentSelect}</strong>
        </h5>
      </div>
    </div>
  );
};

export default SalesCategoryGenderComparison;
