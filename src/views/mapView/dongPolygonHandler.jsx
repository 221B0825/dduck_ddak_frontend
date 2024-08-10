import dongCenterData from "../../apis/dongCenter.json";

export const createDongPolygon = (
  area,
  map,
  setSelectedArea,
  markersRef,
  selectedPolygonRef
) => {
  const path = area.path.map(
    (coords) => new kakao.maps.LatLng(coords.lat, coords.lng)
  );

  const polygon = new kakao.maps.Polygon({
    map: map,
    path: path,
    strokeWeight: 0,
    strokeColor: "#3065FA",
    strokeOpacity: 0.8,
    fillColor: "#fff",
    fillOpacity: 0.2, // 기본 상태의 투명도
    zIndex: 10,
  });

  polygon.code = area.adm_cd;
  polygon.areaName = area.name;

  attachDongPolygonEvents(
    polygon,
    map,
    setSelectedArea,
    markersRef,
    selectedPolygonRef
  );

  return polygon;
};

const attachDongPolygonEvents = (
  polygon,
  map,
  setSelectedArea,
  markersRef,
  selectedPolygonRef
) => {
  kakao.maps.event.addListener(polygon, "click", function () {
    if (selectedPolygonRef.current) {
      if (selectedPolygonRef.current === polygon) {
        // 현재 선택된 폴리곤을 다시 클릭한 경우
        polygon.setOptions({
          fillColor: "#fff",
          fillOpacity: 0.2, // 기본 투명도로 복원
          strokeWeight: 0,
        });

        // 마커 제거
        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];

        // 선택 해제
        selectedPolygonRef.current = null;
        setSelectedArea(null); // 선택된 지역 초기화
      } else {
        // 다른 폴리곤을 클릭한 경우
        selectedPolygonRef.current.setOptions({
          fillColor: "#fff",
          fillOpacity: 0.2, // 기본 투명도로 복원
          strokeWeight: 0,
        });

        polygon.setOptions({
          fillColor: "#09f",
          fillOpacity: 0.5, // 선택된 상태의 투명도
          strokeWeight: 2,
          strokeColor: "#3065FA",
          strokeOpacity: 0.8,
        });

        selectedPolygonRef.current = polygon;
        setSelectedArea({
          name: polygon.areaName,
          code: polygon.code,
          type: "dong",
          calculatedArea: Math.floor(polygon.getArea()),
        });

        addDongMarker(polygon.code, map, markersRef);
      }
    } else {
      // 아무것도 선택되지 않은 상태에서 폴리곤을 처음 클릭한 경우
      polygon.setOptions({
        fillColor: "#09f",
        fillOpacity: 0.5, // 선택된 상태의 투명도
        strokeWeight: 2,
        strokeColor: "#3065FA",
        strokeOpacity: 0.8,
      });

      selectedPolygonRef.current = polygon;
      setSelectedArea({
        name: polygon.areaName,
        code: polygon.code,
        type: "dong",
        calculatedArea: Math.floor(polygon.getArea()),
      });

      addDongMarker(polygon.code, map, markersRef);
    }
  });

  kakao.maps.event.addListener(polygon, "mouseover", function () {
    if (
      markersRef.current.length === 0 &&
      selectedPolygonRef.current !== polygon
    ) {
      polygon.setOptions({
        fillColor: "#FFD700",
        fillOpacity: 0.5, // 호버 상태의 투명도
        strokeColor: "#ff8e25",
        strokeOpacity: 0.2,
        strokeWeight: 2,
      });
    }
  });

  kakao.maps.event.addListener(polygon, "mouseout", function () {
    if (
      markersRef.current.length === 0 &&
      selectedPolygonRef.current !== polygon
    ) {
      polygon.setOptions({
        fillColor: "#fff",
        fillOpacity: 0.2, // 기본 투명도로 복원
        strokeWeight: 0,
      });
    }
  });
};

const addDongMarker = (code, map, markersRef) => {
  markersRef.current.forEach((marker) => marker.setMap(null));
  markersRef.current = [];

  const dongCenter = dongCenterData.find((dong) => dong.adm_cd === code);

  if (dongCenter) {
    const markerPosition = new kakao.maps.LatLng(
      dongCenter.lat,
      dongCenter.lng
    );

    const marker = new kakao.maps.Marker({
      position: markerPosition,
      map: map,
    });

    markersRef.current.push(marker);
  }
};
