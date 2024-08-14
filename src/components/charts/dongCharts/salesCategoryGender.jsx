import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

const SalesCategoryGender = ({ code, category }) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://api.gadduck.info/towns/industry/sales/gender-rate?code=${code}&industryName=${category}`);
        console.log(response);
        
        const data = {
          menPercentage: response.data.data.menPercentage,
          womenPercentage: response.data.data.womenPercentage,
          salesOfIndustry: response.data.data.salesOfIndustry
        };
        
        setChartData(data);
      } catch (error) {
        console.error("Failed to fetch area data", error);
        setChartData(null);
      }
    };
    
    fetchData();
  }, [code, category]);

  useEffect(() => {
    if (chartData && chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      const newChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['남성 매출 비율', '여성 매출 비율'],
          datasets: [{
            label: '성별 매출 비율',
            data: [chartData.menPercentage, chartData.womenPercentage],
            backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
            borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top'
            }
          }
        }
      });

      return () => newChart.destroy();
    }
  }, [chartData]);

  return (
    <div style={{ margin: "80px" }}>
      {chartData ? (
        <>
          <canvas ref={chartRef}></canvas>
          <div className="text-center mt-4">
            <h4>전체 매출: {new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(chartData.salesOfIndustry)}</h4>
          </div>
        </>
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default SalesCategoryGender;
