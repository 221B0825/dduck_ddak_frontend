import React, { useState } from "react";
import CustomHeader from "../../components/customHeader";
import LeftSidebar from "../../components/leftSidebar";
import RightSidebar from "../../components/rightSidebar";
import KakaoMap from "../mapView/KakaoMap";

function MainPage() {
  const [selectedArea, setSelectedArea] = useState(null);

  return (
    <div>
      <CustomHeader />
      <LeftSidebar />
      <RightSidebar selectedArea={selectedArea} />
      <KakaoMap setSelectedArea={setSelectedArea} />
    </div>
  );
}

export default MainPage;
