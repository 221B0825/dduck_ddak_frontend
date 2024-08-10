// src/mapHandlers/guPolygonHandler.js

import guCenterData from "../../apis/guCenter.json";

// 기본 구 폴리곤을 생성하는 함수
export const createDefaultGuPolygon = (area, map) => {
  const path = area.path.map(
    (coords) => new kakao.maps.LatLng(coords.lat, coords.lng)
  );

  const polygon = new kakao.maps.Polygon({
    map: map,
    path: path,
    strokeWeight: 3,
    strokeColor: "#000000",
    strokeOpacity: 0.2,
    fillColor: "#D9D9D9",
    fillOpacity: 0.2,
    zIndex: 1,
  });

  return polygon;
};

// 구 폴리곤 생성 및 이벤트 핸들러 추가
export const createGuPolygon = (
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
    fillOpacity: 0.2,
    zIndex: 5,
  });

  polygon.code = area.name.split(" ")[1];
  polygon.areaName = area.name;

  attachGuPolygonEvents(
    polygon,
    map,
    setSelectedArea,
    markersRef,
    selectedPolygonRef
  );

  return polygon;
};

// 구 폴리곤에 이벤트 핸들러를 추가하는 함수
const attachGuPolygonEvents = (
  polygon,
  map,
  setSelectedArea,
  markersRef,
  selectedPolygonRef
) => {
  kakao.maps.event.addListener(polygon, "click", function () {
    if (selectedPolygonRef.current) {
      selectedPolygonRef.current.setOptions({
        fillColor: "#fff",
        strokeWeight: 0,
      });
    }

    polygon.setOptions({
      fillColor: "#09f",
      strokeWeight: 2,
      strokeColor: "#3065FA",
      strokeOpacity: 0.8,
    });

    selectedPolygonRef.current = polygon;
    setSelectedArea({
      name: polygon.areaName,
      code: polygon.code,
      type: "gu",
    });

    addGuMarker(polygon.code, map, markersRef);
  });

  // 마우스 호버 이벤트 추가
  kakao.maps.event.addListener(polygon, "mouseover", function () {
    if (markersRef.current.length === 0) {
      polygon.setOptions({
        fillColor: "#FFD700",
        fillOpacity: 0.5,
        strokeColor: "#ff8e25",
        strokeOpacity: 0.2,
        strokeWeight: 2,
      });
    }
  });

  kakao.maps.event.addListener(polygon, "mouseout", function () {
    if (markersRef.current.length === 0) {
      polygon.setOptions({
        fillColor: "#fff",
        fillOpacity: 0.2,
        strokeWeight: 0,
      });
    }
  });
};

// 구 중심에 마커를 추가하는 함수
export const addGuMarker = (code, map, markersRef) => {
  markersRef.current.forEach((marker) => marker.setMap(null));
  markersRef.current = [];

  const guCenter = guCenterData.find((gu) => gu.name === "서울특별시 " + code);

  if (guCenter) {
    const markerPosition = new kakao.maps.LatLng(guCenter.lat, guCenter.lng);

    const marker = new kakao.maps.Marker({
      position: markerPosition,
      map: map,
    });

    markersRef.current.push(marker);
  }
};
