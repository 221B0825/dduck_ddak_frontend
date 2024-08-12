import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import categoryData from "../apis/searchCategory.json";

const RankingArea = (isOpen) => {
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedDetailCategory, setSelectedDetailCategory] = useState("");
  const [selectedDetail, setSelectedDetail] = useState("");
  // 주거 인구 선택 시----------------------------------------
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedAgeRange, setSelectedAgeRange] = useState("");

  const handleGenderClick = (gender) => {
    setSelectedGender(gender);
  };

  const handleAgeRangeClick = (ageRange) => {
    setSelectedAgeRange(ageRange);
  };
  // --------------------------------------------------------

  //   업종 카테고리 선택-------------------------------------
  const [inputCategory, setinputCategory] = useState("");
  const [inputDetailCategory, setInputDetailCategory] = useState("");
  const [filteredCategoryList, setFilteredCategoryList] = useState([]);

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

  //----------------------------------------------------

  const handleMainCategoryClick = (category) => {
    setSelectedMainCategory(category);
    setSelectedSubCategory(""); // Reset when main category changes
    setSelectedDetailCategory(""); // Also reset detail category
    setSelectedDetail(""); // Reset detail selection
  };

  const handleSubCategoryClick = (category) => {
    setSelectedSubCategory(category);
    setSelectedDetail(""); // Reset detail selection when subcategory changes
  };

  const handleDetailCategoryClick = (category) => {
    setSelectedDetailCategory(category);
    setSelectedDetail(""); // Reset detail selection when detail category changes
  };

  const handleDetailClick = (detail) => {
    setSelectedDetail(detail); // Set the detailed time/day/age/gender
  };

  return (
    <div id="rankingArea" className="mt-3">
      <hr></hr>
      <h5>상위권 순위 TOP 10</h5>
      <div className="btn-group" role="group" aria-label="Reference">
        {["점포수", "매출", "유동인구", "주거인구"].map((category) => (
          <button
            key={category}
            type="button"
            className={`btn btn-outline-primary ${
              selectedMainCategory === category ? "active" : ""
            }`}
            onClick={() => handleMainCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>
      {/* 기준조건-메인조건에 상관없이 고정 */}
      <h6 className="mt-3">기준조건 선택</h6>
      <div className="btn-group" role="group" aria-label="Basic example">
        {["최고순위", "비교증가율"].map((subCategory) => (
          <button
            key={subCategory}
            type="button"
            className={`btn btn-outline-primary ${
              selectedSubCategory === subCategory ? "active" : ""
            }`}
            onClick={() => handleSubCategoryClick(subCategory)}
          >
            {subCategory}
          </button>
        ))}
      </div>
      {/* 메인 카테고리가 유동인구일 경우 */}
      {selectedMainCategory === "유동인구" && (
        <>
          <h5 className="mt-3">상세 조건 선택</h5>
          <div className="btn-group" role="group" aria-label="Basic example">
            {["시간대별", "요일별", "연령대별", "성별"].map((detail) => (
              <button
                key={detail}
                type="button"
                className={`btn btn-outline-primary ${
                  selectedDetailCategory === detail ? "active" : ""
                }`}
                onClick={() => handleDetailCategoryClick(detail)}
                disabled={!selectedSubCategory} // Disable if no subcategory selected
              >
                {detail}
              </button>
            ))}
          </div>

          {selectedDetailCategory === "시간대별" && (
            <TimeSelection
              selected={selectedDetail}
              handleDetailClick={handleDetailClick}
            />
          )}
          {selectedDetailCategory === "요일별" && (
            <DaySelection
              selected={selectedDetail}
              handleDetailClick={handleDetailClick}
            />
          )}
          {selectedDetailCategory === "연령대별" && (
            <AgeSelection
              selected={selectedDetail}
              handleDetailClick={handleDetailClick}
            />
          )}
          {selectedDetailCategory === "성별" && (
            <GenderSelection
              selected={selectedDetail}
              handleDetailClick={handleDetailClick}
            />
          )}
        </>
      )}
      {/* 메인 카테고리가 매출 또는 점포수일 경우 */}
      {(selectedMainCategory === "매출" ||
        selectedMainCategory === "점포수") && (
        <>
          {/* 업종 카테고리 선택 */}
          {/* 카테고리 선택 */}
          <div className="mt-3">
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
        </>
      )}
      {/* 주거인구 */}
      {selectedMainCategory === "주거인구" && (
        <>
          <LiveGenderSelection
            selected={selectedGender}
            handleGenderClick={handleGenderClick}
          />
          <LiveAgeRangeSelection
            selected={selectedAgeRange}
            handleAgeRangeClick={handleAgeRangeClick}
          />
        </>
      )}
    </div>
  );
};

const TimeSelection = ({ selected, handleDetailClick }) => (
  <div id="timeSelection" className="mt-3">
    <h6>시간대 선택</h6>
    <div className="btn-group" role="group">
      {["00-06시", "06-11시", "11-14시", "14-17시", "17-21시", "21-24시"].map(
        (time) => (
          <button
            key={time}
            type="button"
            className={`btn btn-outline-secondary ${
              selected === time ? "active" : ""
            }`}
            onClick={() => handleDetailClick(time)}
          >
            {time}
          </button>
        )
      )}
    </div>
  </div>
);

const DaySelection = ({ selected, handleDetailClick }) => (
  <div id="daySelection" className="mt-3">
    <h6>요일 선택</h6>
    <div className="btn-group" role="group">
      {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
        <button
          key={day}
          type="button"
          className={`btn btn-outline-secondary ${
            selected === day ? "active" : ""
          }`}
          onClick={() => handleDetailClick(day)}
        >
          {day}
        </button>
      ))}
    </div>
  </div>
);

const AgeSelection = ({ selected, handleDetailClick }) => (
  <div id="ageSelection" className="mt-3">
    <h6>연령대 선택</h6>
    <div className="btn-group" role="group">
      {["10대", "20대", "30대", "40대", "50대", "60대 이상"].map((age) => (
        <button
          key={age}
          type="button"
          className={`btn btn-outline-secondary ${
            selected === age ? "active" : ""
          }`}
          onClick={() => handleDetailClick(age)}
        >
          {age}
        </button>
      ))}
    </div>
  </div>
);

const GenderSelection = ({ selected, handleDetailClick }) => (
  <div id="genderSelection" className="mt-3">
    <h6>성별 선택</h6>
    <div className="btn-group" role="group">
      {["남자", "여자"].map((gender) => (
        <button
          key={gender}
          type="button"
          className={`btn btn-outline-secondary ${
            selected === gender ? "active" : ""
          }`}
          onClick={() => handleDetailClick(gender)}
        >
          {gender}
        </button>
      ))}
    </div>
  </div>
);

const LiveGenderSelection = ({ selected, handleGenderClick }) => (
  <div id="genderSelection" className="mt-3">
    <h6>성별 선택</h6>
    <div className="btn-group" role="group">
      {["전체", "남자", "여자"].map((gender) => (
        <button
          key={gender}
          type="button"
          className={`btn btn-outline-secondary ${
            selected === gender ? "active" : ""
          }`}
          onClick={() => handleGenderClick(gender)}
        >
          {gender}
        </button>
      ))}
    </div>
  </div>
);

const LiveAgeRangeSelection = ({ selected, handleAgeRangeClick }) => (
  <div id="ageSelection" className="mt-3">
    <h6>연령대 선택</h6>
    <div className="btn-group" role="group">
      {["10대", "20대", "30대", "40대", "50대", "60대 이상"].map((ageRange) => (
        <button
          key={ageRange}
          type="button"
          className={`btn btn-outline-secondary ${
            selected === ageRange ? "active" : ""
          }`}
          onClick={() => handleAgeRangeClick(ageRange)}
        >
          {ageRange}
        </button>
      ))}
    </div>
  </div>
);

export default RankingArea;
