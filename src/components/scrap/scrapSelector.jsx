import React, { useEffect, useState } from "react";
import axios from "axios";

const ScrapSelector = ({ setSelectQuery, setScrapEmpty }) => {
  const [scraps, setScraps] = useState([]);
  const [selectedScrap, setSelectedScrap] = useState("");

  const handleFetchScrapInfo = async () => {
    // 문자열로 강제 변환하여 split 수행
    const parts = String(selectedScrap[0].townName).split(" "); // 문자열로 변환 후 공백으로 분리
    if (parts.length > 1) {
      setSelectQuery({ type: "dongCode", data: parts[1] });
    }
  };

  useEffect(() => {
    const fetchScraps = async () => {
      try {
        const response = await axios.get(
          "https://api.gadduck.info/scraps/list?email=hyeri0603@naver.com"
        );

        if (response.status === 200) {
          setScraps(response.data.data);
          if (response.data.data.length > 0) {
            setSelectedScrap(response.data.data); // 기본적으로 첫 번째 스크랩을 선택
          }
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error("Failed to fetch scraps:", error);
      }
    };

    fetchScraps();
  }, []);

  const handleScrapChange = (e) => {
    setSelectedScrap(e.target.value);
  };

  return (
    <div
      style={{
        display: "flex",
        minWidth: "200px",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <select
        class="form-select form-select-sm"
        value={selectedScrap}
        onChange={handleScrapChange}
      >
        {scraps.map((scrap) => (
          <option key={scrap.townCode} value={scrap.townCode}>
            {scrap.townName}
          </option>
        ))}
      </select>
      <button
        onClick={handleFetchScrapInfo}
        className="btn btn-primary mx-2"
        style={{ minWidth: "80px" }}
      >
        조회
      </button>
    </div>
  );
};

export default ScrapSelector;
