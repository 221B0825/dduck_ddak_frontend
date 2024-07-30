import React, { useEffect } from "react";

const KakaoMap = () => {
  useEffect(() => {
    const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;
    console.log(apiKey); // API 키 확인

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
    script.async = true;

    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          const mapContainer = document.getElementById("map");
          const mapOption = {
            center: new window.kakao.maps.LatLng(33.450701, 126.570667),
            level: 3,
          };
          const map = new window.kakao.maps.Map(mapContainer, mapOption);

          const markerPosition = new window.kakao.maps.LatLng(
            33.450701,
            126.570667
          );
          const marker = new window.kakao.maps.Marker({
            position: markerPosition,
          });
          marker.setMap(map);
        });
      }
    };

    document.head.appendChild(script);
  }, []);

  return <div id="map" style={{ width: "100%", height: "400px" }}></div>;
};

export default KakaoMap;
