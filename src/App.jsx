import React from "react";
import KakaoMap from "./KakaoMap";
import KakaoMarkerMap from "./KaKaoMakerMap";

const App = () => {
  return (
    <div>
      <h1>My Kakao Map</h1>
      {/* <KakaoMap /> */}
      <KakaoMarkerMap />
    </div>
  );
};

export default App;
