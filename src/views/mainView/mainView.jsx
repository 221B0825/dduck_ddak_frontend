import CustomHeader from "../../components/customHeader";
import LeftSidebar from "../../components/leftSidebar";
import RightSidebar from "../../components/rightSidebar";
import KakaoMap from "../mapView/KakaoMap";

function MainPage() {
  return (
    <div>
      <CustomHeader />
      <LeftSidebar />
      <RightSidebar />
      <KakaoMap />
    </div>
  );
}

export default MainPage;
