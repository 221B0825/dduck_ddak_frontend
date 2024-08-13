import React, { useState } from "react";
import CustomHeader from "../../components/customHeader";
import LeftSidebar from "../../components/leftSidebar";
import RightSidebar from "../../components/rightSidebar";
import KakaoMap from "../mapView/KakaoMap";

function MainView() {
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectQuery, setSelectQuery] = useState([]);
  const [selectCategory, setSelectCategory] = useState("");
  const [compareMode, setCompareMode] = useState(false);
  const [baseArea, setBaseArea] = useState(null);
  const [compareArea, setCompareArea] = useState(null);

  return (
    <div>
      <CustomHeader 
        selectedArea={selectedArea}
      />
      <LeftSidebar
        setSelectQuery={setSelectQuery}
        setSelectCategory={setSelectCategory}
      />
      <RightSidebar
        selectedArea={selectedArea}
        selectCategory={selectCategory}
        setCompareMode={setCompareMode}
        compareMode={compareMode}
        setBaseArea={setBaseArea}
        setCompareArea={setCompareArea}
        baseArea={baseArea}
        setSelectedArea={setSelectedArea}
      />
      <KakaoMap
        setSelectedArea={setSelectedArea}
        selectQuery={selectQuery}
        compareMode={compareMode}
        baseArea={baseArea}
        compareArea={compareArea}
        setCompareArea={setCompareArea}
      />
    </div>
  );
}

export default MainView;
