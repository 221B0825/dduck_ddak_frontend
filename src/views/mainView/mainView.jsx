import React, { useState } from "react";
import CustomHeader from "../../components/customHeader";
import LeftSidebar from "../../components/leftSidebar";
import RightSidebar from "../../components/rightSidebar";
import KakaoMap from "../mapView/KakaoMap";

function MainPage() {
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedSize, setSelectedSize] = useState("행정동 별 선택");

  return (
    <div>
      <CustomHeader setSelectedSize={setSelectedSize} />
      <LeftSidebar />
      <RightSidebar selectedArea={selectedArea} selectedSize={selectedSize} />
      <KakaoMap setSelectedArea={setSelectedArea} />
    </div>
  );
}

export default MainPage;
