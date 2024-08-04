import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // Bootstrap Icons 추가

const RightSidebar = ({ isSelectedSize, selectedArea }) => {
  const [isOpen, setIsOpen] = useState(false);
  const chartRef = useRef(null);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (selectedArea && selectedArea.additionalData) {
      const { labels, values, expndtr_totamt } = selectedArea.additionalData;
      setTotalAmount(expndtr_totamt);
      console.log("동별 선택: " + isSelectedSize);

      let filteredData;

      // 행정동 별 선택
      if (isSelectedSize) {
        filteredData = labels.reduce(
          (acc, label, index) => {
            if (
              label !== "행정동_코드_명" &&
              label !== "소득_구간_코드" &&
              label !== "기준_년분기_코드" &&
              label !== "월_평균_소득_금액" &&
              label !== "지출_총금액" &&
              label !== "행정동_코드"
            ) {
              acc.labels.push(label);
              acc.values.push(values[index]);
            }
            return acc;
          },
          { labels: [], values: [] }
        );
        // 행정구 별 선택
      } else {
        filteredData = { labels, values };
      }

      const ctx = document.getElementById("myChart").getContext("2d");

      // 기존 차트가 존재하면 제거
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      // 새 차트를 생성하고 참조를 저장
      chartRef.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: filteredData.labels,
          datasets: [
            {
              label: "지출 항목별 금액 (원)",
              data: filteredData.values,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
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
        },
      });
    }
  }, [selectedArea]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      id="rightSidebar-wrapper"
      className="bg-white"
      style={{
        position: "fixed",
        right: 0,
        top: 0,
        height: "100vh",
        zIndex: 2000,
        width: isOpen ? "400px" : "50px",
        transition: "width 0.3s ease-in-out",
      }}
    >
      <button
        id="rightSidebarBtn"
        onClick={toggleSidebar}
        className="btn btn-primary"
        style={{
          position: "absolute",
          top: "50%",
          left: isOpen ? "0px" : "-35px",
          transform: `translateY(-50%) ${
            isOpen ? "translateX(-100%)" : "translateX(0)"
          }`,
        }}
      >
        {isOpen ? (
          <i className="bi bi-caret-right-fill"></i>
        ) : (
          <i className="bi bi-caret-left-fill"></i>
        )}
      </button>
      <div
        className={`sidebar-heading ${
          isOpen ? "show-content" : "hidden-content"
        } mt-4`}
      >
        Right Sidebar
      </div>
      <div
        className={`list-group list-group-flush ${
          isOpen ? "show-content" : "hidden-content"
        }`}
      >
        {selectedArea ? (
          <>
            <div className="list-group-item list-group-item-action bg-light">
              <strong>{selectedArea.name} 분석 보고서</strong>
              <br></br>
            </div>
            <div className="list-group-item list-group-item-action bg-light">
              Name: {selectedArea.name}
            </div>
            <div className="list-group-item list-group-item-action bg-light">
              Code: {selectedArea.adm_cd}
            </div>
            <div className="list-group-item list-group-item-action bg-light">
              Total area: approx {Math.floor(selectedArea.calculatedArea)} m²
            </div>
            <canvas id="myChart" width="400" height="400"></canvas>
            <div className="list-group-item list-group-item-action bg-light">
              지출 총금액: {totalAmount} 원
            </div>
          </>
        ) : (
          <div className="list-group-item list-group-item-action bg-light">
            No area selected
          </div>
        )}
        <a href="#" className="list-group-item list-group-item-action bg-light">
          Upcoming Events
        </a>
        <a href="#" className="list-group-item list-group-item-action bg-light">
          Recent News
        </a>
        <a href="#" className="list-group-item list-group-item-action bg-light">
          Top Achievements
        </a>
        <a href="#" className="list-group-item list-group-item-action bg-light">
          Featured Articles
        </a>
        <a href="#" className="list-group-item list-group-item-action bg-light">
          Community Spotlight
        </a>
      </div>
    </div>
  );
};

export default RightSidebar;
