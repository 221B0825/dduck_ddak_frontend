import React, { useState } from "react";
import CustomHeader from "../../components/customHeader";
import LeftSidebar from "../../components/leftSidebar";
import RightSidebar from "../../components/rightSidebar";
import KakaoMap from "../mapView/KakaoMap";

function MainPage() {
  const [selectedArea, setSelectedArea] = useState(null);
  const [isSelectedSize, setSelectedSize] = useState(true);

  return (
    <div>
      <CustomHeader setSelectedSize={setSelectedSize} />
      <LeftSidebar />
      <RightSidebar
        selectedArea={selectedArea}
        isSelectedSize={isSelectedSize}
      />
      <KakaoMap
        setSelectedArea={setSelectedArea}
        isSelectedSize={isSelectedSize}
      />
    </div>
  );
}

export default MainPage;
