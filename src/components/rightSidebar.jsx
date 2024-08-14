import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// pdf
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import pretendard from "../assets/fonts/pretendard";

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
import SalesQuater from "./charts/dongCharts/salesQuater";
import FloatingQuarter from "./charts/dongCharts/floatingQuarter";

import PopulationTimeComparison from "./charts/dongComparisonCharts/populationTimeComparison";

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

  // 분기별 유동인구 순위
  const [summaryRank, setSummaryRank] = useState([]);

   // 분기별 매출 순위
   const [summarySalesRank, setSummarySalesRank] = useState([]);

  // 분기별 유동인구
  const [summaryQuarter, setSummaryQuarter] = useState("");
  // 시간별 유동인구
  const [summaryTime, setSummaryTime] = useState("");
  // 시간별 매출
  const [summary, setSummary] = useState("");
  // 시설 개수
  const [summaryFacility, setSummaryFacility] = useState("");

  const handleCategoryChange = (e) => {
    setinputCategory(e.target.value);
  };

  const handleDetailCategoryChange = (e) => {
    setInputDetailCategory(e.target.value);
  };

  useEffect(() => {
    selectCategory = inputDetailCategory;
  }, [inputDetailCategory]);

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
    const containers = document.querySelectorAll(".chart-container");
    const doc = new jsPDF("p", "mm", "a4");
    const docName = baseArea.name;
    doc.addFileToVFS("pretendard.ttf", pretendard);
    doc.addFont("pretendard.ttf", "pretendard", "normal");
    doc.setFont("pretendard"); // set font

    // logo
    let logoUrl =
      "https://raw.githubusercontent.com/Lazy-Mechanics/dduck_ddak_backend/main/src/main/resources/gadduck.png";
    const imgProps = doc.getImageProperties(logoUrl);
    const logoWidth = 30; // 로고의 폭 
    const logoHeight = (imgProps.height * logoWidth) / imgProps.width; // 비율 유지를 위한 높이 계산
    const logoX = doc.internal.pageSize.getWidth() / 2 - logoWidth / 2; // 중앙 정렬
    const logoY = 80; // 상단에서부터의 거리
    doc.addImage(logoUrl, "PNG", logoX, logoY, logoWidth, logoHeight);

    // 첫 페이지에 제목 추가
    doc.setFontSize(17);
    doc.text(docName, 105, 130, null, null, "center"); // 105는 A4 가운데, 20은 위에서부터의 거리
    doc.text("2024년 1분기 상권 분석 보고서", 105, 140, null, null, "center");
    doc.text("가게 뚝딱 팀 드림", 105, 150, null, null, "center");
    // 발행일자 추가 (발급 시간대) ex) 2024년 8월 3일
    doc.text(new Date().toLocaleDateString(), 105, 160, null, null, "center");
    doc.addPage();

    let yPos = 0; // 첫 차트의 시작 위치 설정

    for (let i = 0; i < containers.length; i++) {
      const canvas = await html2canvas(containers[i]);
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 190; // A4 폭 mm
      const scaledHeight = (canvas.height * imgWidth) / canvas.width;
      const imgHeight = scaledHeight > 125 ? 125 : scaledHeight; // 차트 높이 조정 (최대 125mm)

      if (i > 0 && i % 2 === 0) {
        // 페이지를 넘기는 조건 (i가 0이 아니고, 짝수일 때)
        doc.addPage();
        yPos = 10; // 새 페이지에서의 시작 높이 설정
      }

      doc.addImage(imgData, "PNG", 10, yPos, imgWidth, imgHeight);
      yPos += imgHeight + 10; // 다음 차트의 시작 위치 업데이트 (차트 사이의 여백 10mm)
    }

    doc.save(docName + ".pdf");
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

  const resetCategory = () => {
    setinputCategory("");
    setInputDetailCategory("");
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
        width: isOpen ? "500px" : "50px",
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
        style={{ maxHeight: "940px", overflowY: "auto" }}
      >
        {selectedArea ? (
          <>
            <div className="list-group-item list-group-item-action bg-light mt-5">
              <strong>{selectedArea.name} 분석 보고서</strong>
            </div>
            <div
              id="switch"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <label
                style={{
                  marginLeft: "20px",
                  color: compareMode ? "initial" : "#0D6EFD",
                  fontWeight: compareMode ? "normal" : "bold",
                }}
              >
                단일 행정동
              </label>
              <div className="form-check form-switch m-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="compareModeSwitch"
                  checked={compareMode}
                  onChange={handleCompareClick}
                />
              </div>
              <label
                style={{
                  marginRight: "20px",
                  color: compareMode ? "#0D6EFD" : "initial",
                  fontWeight: compareMode ? "bold" : "normal",
                }}
              >
                행정동 비교
              </label>
            </div>
            <button
              type="button"
              className="btn btn-primary m-3"
              onClick={exportPDF}
            >
              보고서 다운받기
            </button>

            <div>
              {/* 카테고리 선택 */}
              <div className="ms-3 me-3">
                <hr></hr>
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
              <button
                type="button"
                className="btn btn-secondary btn-sm m-3"
                onClick={resetCategory}
              >
                카테고리 선택 초기화
              </button>

              {/* 비교 모드일 때 */}
              {compareMode ? (
                baseArea &&
                selectedArea && (
                  <>
                    <div className="chart-container">
                      <IndustrySalesComparison
                        name1={baseArea.name}
                        code1={baseArea.code}
                        name2={selectedArea.name}
                        code2={selectedArea.code}
                        category={inputDetailCategory}
                        setSummary={setSummary}
                      />
                      <div>{summary}</div>
                      <hr></hr>
                      <PopulationTimeComparison
                        name1={baseArea.name}
                        code1={baseArea.code}
                        name2={selectedArea.name}
                        code2={selectedArea.code}
                      />
                    </div>
                  </>
                )
              ) : (
                // 비교 모드가 아닐 때
                <>
                  {/*  업종을 선택했을 때 */}
                  {inputDetailCategory ? (
                    <>
                      <div className="chart-container">
                        <IndustryMulti
                          code={selectedArea.code}
                          category={inputDetailCategory}
                        />
                        <hr></hr>
                        <div>{IndustryMulti.summary}</div>
                      </div>
                      <div className="chart-container">
                        <IndustrySales
                          code={selectedArea.code}
                          category={inputDetailCategory}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* 업종을 선택하지 않았을 때 */}
                      {/* 점포 영업기간 */}
                      <div className="chart-container">
                        <div
                          className="col-7 mt-3"
                          style={{
                            border: "1px solid #D9D9D9",
                            borderRadius: "5px",
                            margin: "10px",
                            marginLeft: "100px",
                            textAlign: "center",
                          }}
                        >
                        <IndustryBusiness code={selectedArea.code} />
                        </div>
                      </div>
                      {/* 분기별 매출 유동인구 추이 */}
                      <div className="chart-container">
                        <h5 className="ms-3" style={{ fontWeight: "bold" }}>
                            분기별 유동인구
                        </h5>
                        <div style={{display: "flex",  marginLeft: "20px", marginRight: "35px"}}>
                        <div
                          className="col-6 mt-3"
                          style={{
                            border: "1px solid #D9D9D9",
                            borderRadius: "5px",
                            margin: "5px",
                            padding: "5px",
                            textAlign: "left",
                            display: "flex",
                            justifyContent: "space-between",
                          
                          }}
                        >
                          
                          <span>구 내 행정동 순위 </span>
                          
                        <span style={{fontWeight: "bold", color: "#3065FA"}}>{summaryRank[0]} </span> / {summaryRank[1]}
                      </div>
                      <div
                          className="col-6 mt-3"
                          style={{
                            border: "1px solid #D9D9D9",
                            borderRadius: "5px",
                            margin: "5px",
                            padding: "5px",
                            textAlign: "left",
                            display: "flex",
                            justifyContent: "space-between"
                          }}
                        >
                        <span>시 내 행정동 순위 </span>
                        <span style={{fontWeight: "bold", color: "#3065FA"}}> {summaryRank[2]}</span> / {summaryRank[3]}
                        </div>
                        </div>
                        <FloatingQuarter code={selectedArea.code} setSummaryRank={setSummaryRank} />
                        {/* summary를 위한 보이지 않는 차트 */}
                        <div style={{display: "none"}}>
                          <PopulationQuarter code={selectedArea.code}
                          setSummary={setSummaryQuarter}/>
                          </div>

                        <div style={{ textAlign: "center" }}>
                          <h5>
                            현재 동의 분기별 유동인구는 <br></br>전분기 대비{" "}
                            <strong className="text-primary">
                              {summaryQuarter}
                            </strong>{" "}
                            입니다.
                          </h5>
                          <hr></hr>
                        </div>
                      </div>

                      {/* 분기별 매출 구/시 합본 */}
                      <div className="chart-container">
                        <h5 className="ms-3" style={{ fontWeight: "bold" }}>
                            분기별 매출
                        </h5>
                       <SalesQuater code={selectedArea.code} setSummarySalesRank={setSummarySalesRank} />
                        <hr></hr>
                      </div>

                      {/* 시간대별 유동인구 */}
                      <div className="chart-container">
                        <h5 className="ms-3" style={{ fontWeight: "bold" }}>
                          시간대별 유동인구
                        </h5>
                        <PopulationTime
                          code={selectedArea.code}
                          setSummary={setSummaryTime}
                        />

                        <div style={{ textAlign: "center" }}>
                          <h5>
                            현재 동의 시간대별 유동인구가 <br></br> 가장 많을
                            때는{" "}
                            <strong className="text-primary">
                              {summaryTime}
                            </strong>{" "}
                            입니다.
                          </h5>
                          <hr></hr>
                        </div>
                      </div>

                      {/* 직장유동인구/주거 인구 2024년1분기만 */}
                      <div className="chart-container">
                        <h5 className="ms-3" style={{ fontWeight: "bold" }}>
                          직장/주거 인구
                        </h5>
                        <PopulationMulti code={selectedArea.code} />
                      </div>
                      <hr></hr>

                      {/* 시간대별 매출 - 업종 전체 */}
                      <div className="chart-container">
                        <h5 className="ms-3" style={{ fontWeight: "bold" }}>
                          시간대별 매출
                        </h5>
                        <SalesTime
                          code={selectedArea.code}
                          setSummary={setSummary}
                        />

                        <div style={{ textAlign: "center" }}>
                          <h5>
                            현재 동의 시간대별 매출이 <br></br> 가장 많을 때는{" "}
                            <strong className="text-primary">{summary}</strong>{" "}
                            입니다.
                          </h5>
                          <hr></hr>
                        </div>
                      </div>

                      {/* 집객시설 */}
                      <div className="chart-container">
                        <h5 className="ms-3" style={{ fontWeight: "bold" }}>
                          집객 시설 개수
                        </h5>
                        <TownFacility
                          code={selectedArea.code}
                          setSummary={setSummaryFacility}
                        />
                        <div style={{ textAlign: "center" }}>
                          <h5>
                            선택상권은{" "}
                            <strong className="text-primary">
                              {summaryFacility}
                            </strong>{" "}
                            비율이 가장 높습니다.
                          </h5>
                        </div>
                      </div>
                    </>
                  )}
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
