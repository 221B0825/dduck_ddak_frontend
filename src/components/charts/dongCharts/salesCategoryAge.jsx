import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

const SalesCategoryAge = ({ code, category }) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://api.gadduck.info/towns/industry/sales/age-rate?code=${code}&industryName=${category}`);
        console.log(response);

        const data = {
          age10sSales: response.data.data.age10sSales,
          age20sSales: response.data.data.age20sSales,
          age30sSales: response.data.data.age30sSales,
          age40sSales: response.data.data.age40sSales,
          age50sSales: response.data.data.age50sSales,
          age60sSales: response.data.data.age60sAndMoreSales,
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
        type: 'bar',
        data: {
          labels: ["10대", "20대", "30대", "40대", "50대", "60대 이상"],
          datasets: [{
            label: `${category} 나이대별 매출 비율`,
            data: Object.values(chartData),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              display: true
            }
          }
        }
      });

      return () => newChart.destroy();
    }
  }, [chartData]);

  return (
    <div style={{ margin: "40px" }}>
      {chartData ? <canvas ref={chartRef} /> : <p>Loading chart...</p>}
    </div>
  );
}

export default SalesCategoryAge;
