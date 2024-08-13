import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// pdf 
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import pretendard from '../assets/fonts/pretendard';

// 차트 및 기타 컴포넌트 임포트
import PopulationQuarter from "./charts/dongCharts/populationQuarter";
import PopulationTime from "./charts/dongCharts/populationTime";
import SalesTime from "./charts/dongCharts/salesTime";
import IndustrySales from "./charts/dongCharts/industrySales";
import IndustryBusiness from "./labels/industryBusiness";
import TownFacility from "./charts/dongCharts/townsFacility";
import IndustryMulti from "./charts/dongCharts/industryMulti";
import PopulationMulti from "./charts/dongCharts/populationMulti";
import IndustrySalesComparison from "./charts/dongComparisonCharts/industrySalesComparison";

import categoryData from "../apis/searchCategory.json";

const RightSidebar = ({
  selectedArea,
  selectCategory,
  setCompareArea,
  setBaseArea,
  baseArea,
  compareArea,
  compareMode,
  setCompareMode,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [inputCategory, setinputCategory] = useState("");
  const [inputDetailCategory, setInputDetailCategory] = useState("");
  const [filteredCategoryList, setFilteredCategoryList] = useState([]);

  // 분기별 유동인구
  const [summaryQuarter, setSummaryQuarter] = useState('');
  // 시간별 유동인구
  const [summaryTime, setSummaryTime] = useState('');
  // 시간별 매출
  const [summary, setSummary] = useState('');
  // 시설 갯수
  const [summaryFacility, setSummaryFacility] = useState('');

  const handleCategoryChange = (e) => {
    setinputCategory(e.target.value);
  };

  const handleDetailCategoryChange = (e) => {
    setInputDetailCategory(e.target.value);
  };

  useEffect(() => {
    if (inputCategory) {
      const detailList = categoryData.하위카테고리[inputCategory] || [];
      setFilteredCategoryList(detailList);
      setinputCategory(inputCategory);
    } else {
      setFilteredCategoryList([]);
    }
    setInputDetailCategory("");
  }, [inputCategory]);

  useEffect(() => {
    if (
      compareMode &&
      selectedArea &&
      selectedArea.code !== (baseArea?.code || "")
    ) {
      setCompareArea(selectedArea);
    } else if (!compareMode) {
      setBaseArea(selectedArea);
    }
  }, [
    selectedArea,
    compareMode,
    baseArea,
    compareArea,
    setCompareArea,
    setBaseArea,
  ]);

  const exportPDF = async () => {
    const containers = document.querySelectorAll('.chart-container');
    const doc = new jsPDF('p', 'mm', 'a4');
    const docName = baseArea.name + ' 2024년 1분기 상권 분석 보고서';
    doc.addFileToVFS('pretendard.ttf', pretendard);
    doc.addFont('pretendard.ttf', 'pretendard', 'normal');
    doc.setFont('pretendard'); // set font

    // logo
    let logoUrl = 'https://raw.githubusercontent.com/Lazy-Mechanics/dduck_ddak_backend/main/src/main/resources/gadduck.png';
    const imgProps = doc.getImageProperties(logoUrl);
    const logoWidth = 30; // 로고의 폭
    const logoHeight = imgProps.height * logoWidth / imgProps.width; // 비율 유지를 위한 높이 계산
    const logoX = (doc.internal.pageSize.getWidth() / 2) - (logoWidth / 2); // 중앙 정렬
    const logoY = 80; // 상단에서부터의 거리
    doc.addImage(logoUrl, 'PNG', logoX, logoY, logoWidth, logoHeight);

    // 첫 페이지에 제목 추가
    doc.setFontSize(17);
    doc.text(docName, 105, 130, null, null, 'center'); // 105는 A4 가운데, 20은 위에서부터의 거리
    doc.text('가게 뚝딱 팀 드림', 105, 140, null, null, 'center');
    // 발행일자 추가 (발급 시간대) ex) 2024년 8월 3일
    doc.text(new Date().toLocaleDateString(), 105, 150, null, null, 'center');
    doc.addPage();

    let yPos = 0; // 첫 차트의 시작 위치 설정

    for (let i = 0; i < containers.length; i++) {
        const canvas = await html2canvas(containers[i]);
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210; // A4 폭 mm
        const scaledHeight = canvas.height * imgWidth / canvas.width;
        const imgHeight = scaledHeight > 125 ? 125 : scaledHeight; // 차트 높이 조정 (최대 125mm)

        if (i > 0 && i % 2 === 0) { // 페이지를 넘기는 조건 (i가 0이 아니고, 짝수일 때)
            doc.addPage();
            yPos = 10; // 새 페이지에서의 시작 높이 설정
        }

        doc.addImage(imgData, 'PNG', 0, yPos, imgWidth, imgHeight);
        yPos += imgHeight + 10; // 다음 차트의 시작 위치 업데이트 (차트 사이의 여백 10mm)
    }

    doc.save(docName + '.pdf');
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleCompareClick = () => {
    setCompareMode((prevCompareMode) => {
      if (!prevCompareMode) {
        setBaseArea(selectedArea);
        setCompareArea(null); // 초기화 후 새로운 비교 영역 선택 대기
      } else {
        setBaseArea(null);
        setCompareArea(null);
      }
      return !prevCompareMode;
    });
  };

  const handleScrapClick = () => {
    sendScrapRequest(); // 함수 호출
  };

  const sendScrapRequest = async () => {
    try {
      const response = await fetch("https://api.gadduck.info/scraps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 쿠키를 포함시키기 위해 credentials 설정
        body: JSON.stringify({
          email: "hyeri0603@naver.com",
          "town-code": selectedArea.code,
          "industry-name": selectCategory,
          quarter: 20241,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      alert("스크랩 요청이 성공적으로 처리되었습니다.");
    } catch (error) {
      console.error("스크랩 요청 중 에러가 발생했습니다:", error);
      alert("스크랩 요청에 실패했습니다.");
    }
  };

  return (
    <div
      id="rightSidebar-wrapper"
      className="bg-white md-5"
      style={{
        position: "fixed",
        right: 0,
        top: 0,
        height: "100vh",
        zIndex: 2000,
        width: isOpen ? "550px" : "50px",
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
        className={`list-group list-group-flush ${
          isOpen ? "show-content" : "hidden-content"
        }`}
        style={{ maxHeight: "950px", overflowY: "auto" }}
      >
        {selectedArea ? (
          <>
            <div className="list-group-item list-group-item-action bg-light mt-5">
              <strong>{selectedArea.name} 분석 보고서</strong>
              <br />
            </div>
            <div className="list-group-item list-group-item-action bg-light">
              위치: {selectedArea.name}
            </div>
            <div className="form-check form-switch m-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="compareModeSwitch"
                checked={compareMode}
                onChange={handleCompareClick}
              />
              <label className="form-check-label" htmlFor="compareModeSwitch">
                {compareMode ? "행정동 비교" : "행정동 정보"}
              </label>
            </div>
            <button
              type="button"
              className="btn btn-warning m-3"
              onClick={handleScrapClick}
            >
              스크랩
            </button>
            <button type="button" className="btn btn-primary m-3" onClick={exportPDF}>보고서 다운받기</button>
            
            <div>
              {/* 카테고리 선택 */}
              <div>
                <select
                  className="form-select"
                  value={inputCategory}
                  onChange={handleCategoryChange}
                  style={{ marginBottom: "10px" }}
                  disabled={!isOpen} // 사이드바가 닫혀 있으면 선택 불가
                >
                  <option value="">카테고리 선택</option>
                  {categoryData.상위카테고리.map((상위카테고리) => (
                    <option key={상위카테고리} value={상위카테고리}>
                      {상위카테고리}
                    </option>
                  ))}
                </select>

                {/* 하위 카테고리 선택 */}
                <select
                  className="form-select"
                  value={inputDetailCategory}
                  onChange={handleDetailCategoryChange}
                  style={{ marginBottom: "10px" }}
                  disabled={!inputCategory || !isOpen} // 상위 카테고리가 선택되지 않았거나 사이드바가 닫혀 있으면 선택 불가
                >
                  <option value="">하위 카테고리 선택</option>
                  {filteredCategoryList.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              {compareMode ? (
                baseArea &&
                selectedArea && (
                  <>
                    <div className="chart-container">
                    <IndustrySalesComparison
                      code1={baseArea.code}
                      code2={selectedArea.code}
                      category={"패스트푸드점"}
                      setSummary={setSummary}
                    />
                    <div>{summary}</div></div>
                  </>
                )
              ) : (
                <>
                  {selectCategory ? (
                    <>
                      <div className="chart-container">
                      <IndustryMulti
                        code={selectedArea.code}
                        category={selectCategory}
                      /><div>{IndustryMulti.summary}</div></div>
                      <div className="chart-container">
                      <IndustrySales
                        code={selectedArea.code}
                        category={selectCategory}
                      /></div>
                      <div className="chart-container">
                      <IndustryBusiness
                        code={selectedArea.code}
                        category={selectCategory}
                      /></div>
                    </>
                  ) : (
                    <>
                      <div className="chart-container">
                      <PopulationQuarter code={selectedArea.code} setSummary={setSummaryQuarter}/>
                      <div style={{ textAlign: 'center' }}>
                        <h5>현재 동의 분기별 유동인구는 <br></br>전분기 대비 <strong className="text-primary">{summaryQuarter}</strong> 입니다.</h5>
                      </div>
                      </div>
                      <hr></hr>
                      <div className="chart-container">
                      <PopulationTime code={selectedArea.code} setSummary={setSummaryTime}/>
                      <div style={{ textAlign: 'center' }}>
                        <h5>매출이 가장 많은 시간대는 <strong className="text-primary">{summary}</strong> 입니다.</h5>
                      </div>
                      </div>
                      <hr></hr>
                    </>
                  )}
                  <div className="chart-container">
                  <PopulationMulti code={selectedArea.code} />
                  </div>
                  <div className="chart-container">
                  <TownFacility code={selectedArea.code} setSummary={setSummaryFacility} />
                  <div style={{ textAlign: 'center' }}>
                    <h5>선택상권은 <strong className="text-primary">{summaryFacility}</strong> 비율이 가장 높습니다.</h5>
                  </div>
                  </div>
                  <hr></hr>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="list-group-item list-group-item-action bg-light">
            No area selected
          </div>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
