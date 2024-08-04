import React, { useState } from "react";
import CustomHeader from "../../components/customHeader";
import LeftSidebar from "../../components/leftSidebar";
import RightSidebar from "../../components/rightSidebar";
import KakaoMap from "../mapView/KakaoMap";

function MainPage() {
  const [selectedArea, setSelectedArea] = useState(null);
  const [isSelectedSize, setSelectedSize] = useState(true);
  const [selectQuery, setSelectQuery] = useState([]);

  return (
    <div>
      <CustomHeader setSelectedSize={setSelectedSize} />
      <LeftSidebar setSelectQuery={setSelectQuery} />
      <RightSidebar
        selectedArea={selectedArea}
        isSelectedSize={isSelectedSize}
      />
      <KakaoMap
        setSelectedArea={setSelectedArea}
        isSelectedSize={isSelectedSize}
        selectQuery={selectQuery}
      />
    </div>
  );
}

export default MainPage;
