import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import searchData from "../apis/searchArea.json";
import searchCategoryData from "../apis/searchCategory.json";

function LeftSidebar({ setSelectQuery, setSelectCategory }) {
  const [isOpen, setIsOpen] = useState(true);
  const [selectInput, setSelectInput] = useState("");
  const [selectedGu, setSelectedGu] = useState("");
  const [selectedDong, setSelectedDong] = useState("");
  const [selectedDongCode, setSelectedDongCode] = useState("");
  const [filteredDongList, setFilteredDongList] = useState([]);
  const contentRef = useRef(null);

  const [inputCategory, setinputCategory] = useState("");
  const [inputDetailCategory, setInputDetailCategory] = useState("");
  const [filteredCategoryList, setFilteredCategoryList] = useState([]);

  useEffect(() => {
    if (selectedGu) {
      const dongList = searchData.dongList[selectedGu] || [];
      setFilteredDongList(dongList);
      setSelectInput(selectedGu);
    } else {
      setFilteredDongList([]);
      setSelectInput("");
    }
    setSelectedDong("");
    setSelectedDongCode("");
  }, [selectedGu]);

  useEffect(() => {
    if (inputCategory) {
      const detailList = searchCategoryData.하위카테고리[inputCategory] || [];
      setFilteredCategoryList(detailList);
      setinputCategory(inputCategory);
    } else {
      setFilteredCategoryList([]);
      setinputCategory("");
    }
    setInputDetailCategory("");
    setSelectCategory("");
  }, [inputCategory]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleGuChange = (e) => {
    setSelectedGu(e.target.value);
  };

  const handleDongChange = (e) => {
    const dong = filteredDongList.find((dong) => dong.name === e.target.value);
    setSelectedDong(e.target.value);
    setSelectedDongCode(dong ? dong.adm_cd : "");
    setSelectInput(selectedGu + " " + e.target.value);
  };

  const handleCategoryChange = (e) => {
    setinputCategory(e.target.value);
  };

  const handleDetailCategoryChange = (e) => {
    setInputDetailCategory(e.target.value);
    setSelectCategory(e.target.value);
  };

  useEffect(() => {
    const contentElement = contentRef.current;
    const handleTransitionEnd = () => {
      if (isOpen) {
        contentElement.classList.add("show-content");
      } else {
        contentElement.classList.remove("show-content");
      }
    };
    contentElement.addEventListener("transitionend", handleTransitionEnd);

    return () => {
      contentElement.removeEventListener("transitionend", handleTransitionEnd);
    };
  }, [isOpen]);

  function editQuery() {
    if (selectedGu) {
      if (selectedDong) {
        // setSelectedSize(true);
        setSelectQuery({ type: "dongCode", data: selectedDongCode });
      } else {
        // setSelectedSize(false);
        setSelectQuery({ type: "guName", data: selectedGu });
      }
    } else {
      alert("구 또는 동을 선택해 주십시오.");
    }
  }

  return (
    <div
      id="leftSidebar-wrapper"
      className="bg-white"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        height: "100vh",
        zIndex: 2000,
        width: isOpen ? "350px" : "50px",
        transition: "width 0.3s ease-in-out",
      }}
    >
      <button
        id="leftSidebarBtn"
        onClick={toggleSidebar}
        className="btn btn-primary"
        style={{
          position: "absolute",
          top: "50%",
          right: isOpen ? "-35px" : "-35px",
          transform: "translateY(-50%)",
        }}
      >
        {isOpen ? (
          <i className="bi bi-caret-left-fill"></i>
        ) : (
          <i className="bi bi-caret-right-fill"></i>
        )}
      </button>
      <div
        id="searchArea"
        className={`sidebar-heading ${
          isOpen ? "show-content" : "hidden-content"
        }`}
        ref={contentRef}
        style={{ marginTop: "80px", padding: "20px" }}
      >
        <h3 className="md-2">검색조건</h3>
        <hr />
        <div className="d-flex justify-content-between">
          <input
            type="text"
            className="form-control"
            placeholder="구 또는 동을 선택해주세요"
            value={selectInput}
            onChange={(e) => setSelectInput(e.target.value)}
            style={{ marginBottom: "10px" }}
            disabled
            readOnly
          />
          <button
            id="searchBtn"
            className="btn btn-primary"
            onClick={() => {
              editQuery();
              // alert(
              //   `Searching for: ${selectInput} in ${selectedGu} ${selectedDong} (${selectedDongCode})`
              // );
            }}
            style={{ margin: "0 10px 10px 10px" }}
            disabled={!isOpen} // 버튼이 활성화 상태일 때만 작동하도록 설정
          >
            <i className="bi bi-search"></i>
          </button>
        </div>

        {/* 구 선택 */}
        <select
          className="form-select"
          value={selectedGu}
          onChange={handleGuChange}
          style={{ marginBottom: "10px" }}
          disabled={!isOpen} // 사이드바가 닫혀 있으면 선택 불가
        >
          <option value="">구 선택</option>
          {searchData.guList.map((gu) => (
            <option key={gu} value={gu}>
              {gu}
            </option>
          ))}
        </select>

        {/* 동 선택 */}
        <select
          className="form-select"
          value={selectedDong}
          onChange={handleDongChange}
          style={{ marginBottom: "10px" }}
          disabled={!selectedGu || !isOpen} // 사이드바가 닫혀 있거나 구가 선택되지 않은 경우 선택 불가
        >
          <option value="">동 선택</option>
          {filteredDongList.map((dong) => (
            <option key={dong.adm_cd} value={dong.name}>
              {dong.name}
            </option>
          ))}
        </select>

        {/* 카테고리 선택 */}
        <hr />
        <select
          className="form-select"
          value={inputCategory}
          onChange={handleCategoryChange}
          style={{ marginBottom: "10px" }}
          disabled={!isOpen} // 사이드바가 닫혀 있으면 선택 불가
        >
          <option value="">카테고리 선택</option>
          {searchCategoryData.상위카테고리.map((상위카테고리) => (
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

        <div id="resetBtnArea">
          <button
            id="resetBtn"
            className="btn btn-secondary"
            onClick={() => {
              setSelectInput("");
              setSelectedGu("");
              setSelectedDong("");
              setSelectedDongCode("");
              setFilteredDongList([]);
              setSelectCategory("");
              setinputCategory("");
              setInputDetailCategory("");
            }}
            style={{ margin: "0 10px 10px 10px" }}
            disabled={!isOpen} // 사이드바가 닫혀 있으면 작동하지 않도록 설정
          >
            초기화
          </button>
        </div>

        <div>
            <h3>TOP 10 지역</h3>
          
        </div>
      </div>
    </div>
  );
}
export default LeftSidebar;
