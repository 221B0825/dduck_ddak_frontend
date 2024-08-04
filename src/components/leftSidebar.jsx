import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import searchData from "../apis/searchArea.json";

function LeftSidebar({ setSelectQuery }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectInput, setSelectInput] = useState("");
  const [selectedGu, setSelectedGu] = useState("");
  const [selectedDong, setSelectedDong] = useState("");
  const [selectedDongCode, setSelectedDongCode] = useState("");
  const [filteredDongList, setFilteredDongList] = useState([]);
  const contentRef = useRef(null);

  useEffect(() => {
    // 선택된 '구'에 따라 '동' 목록을 필터링
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
  }, [selectedGu]); // 'selectedGu'가 변경될 때만 이 코드를 실행

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleGuChange = (e) => {
    setSelectedGu(e.target.value);
  };

  const handleDongChange = (e) => {
    const dong = filteredDongList.find((dong) => dong.name === e.target.value);
    // 동 이름 설정
    setSelectedDong(e.target.value);
    // 동 코드 설정
    setSelectedDongCode(dong ? dong.adm_cd : "");
    // 구 이름 + 동 이름으로 query 설정
    setSelectInput(selectedGu + " " + e.target.value);
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
        setSelectQuery({ type: "dongCode", data: selectedDongCode });
      } else {
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
            placeholder="구 또는 동을 입력해주세요"
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
              alert(
                `Searching for: ${selectInput} in ${selectedGu} ${selectedDong} (${selectedDongCode})`
              );
            }}
            style={{ margin: "0 10px 10px 10px" }}
          >
            <i className="bi bi-search"></i>
          </button>
        </div>

        <select
          className="form-select"
          value={selectedGu}
          onChange={handleGuChange}
          style={{ marginBottom: "10px" }}
        >
          <option value="">구 선택</option>
          {searchData.guList.map((gu) => (
            <option key={gu} value={gu}>
              {gu}
            </option>
          ))}
        </select>

        <select
          className="form-select"
          value={selectedDong}
          onChange={handleDongChange}
          style={{ marginBottom: "10px" }}
          disabled={!selectedGu}
        >
          <option value="">동 선택</option>
          {filteredDongList.map((dong) => (
            <option key={dong.adm_cd} value={dong.name}>
              {dong.name}
            </option>
          ))}
        </select>

        <div className="d-flex justify-content-between">
          <div className="badgeArea"></div>
        </div>
      </div>
    </div>
  );
}

export default LeftSidebar;
