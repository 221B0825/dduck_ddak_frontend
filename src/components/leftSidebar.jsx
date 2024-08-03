import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import searchData from "../apis/searchArea.json";

function LeftSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGu, setSelectedGu] = useState("");
  const [selectedDong, setSelectedDong] = useState("");
  const [selectedDongCode, setSelectedDongCode] = useState("");
  const [filteredDongList, setFilteredDongList] = useState([]);

  useEffect(() => {
    console.log(filteredDongList);
  }, [filteredDongList]); // filteredDongList가 변할 때마다 로그를 찍음

  useEffect(() => {
    // 선택된 '구'에 따라 '동' 목록을 필터링
    console.log(selectedGu);
    if (selectedGu) {
      const dongList = searchData.dongList[selectedGu] || [];
      setFilteredDongList(dongList);
      console.log(filteredDongList);
      setSelectedDong(""); // '구'가 변경되면 '동' 선택을 초기화
      setSelectedDongCode("");
    } else {
      setFilteredDongList([]);
    }
  }, [selectedGu]); // 'selectedGu'가 변경될 때만 이 코드를 실행

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
  };

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
        className={`sidebar-heading ${isOpen ? "" : "d-none"}`}
        style={{ marginTop: "80px", padding: "20px" }}
      >
        <h3 className="md-2">검색조건</h3>
        <hr />
        <div className="d-flex justify-content-between">
          <input
            type="text"
            className="form-control"
            placeholder="구 또는 동을 입력해주세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginBottom: "10px" }}
          />
          <button
            className="btn btn-primary"
            onClick={() =>
              alert(
                `Searching for: ${searchQuery} in ${selectedGu} ${selectedDong} (${selectedDongCode})`
              )
            }
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
