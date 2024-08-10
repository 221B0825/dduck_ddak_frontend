// src/mapHandlers/dongPolygonHandler.js

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
    fillOpacity: 0.2,
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
      type: "dong",
      calculatedArea: Math.floor(polygon.getArea()),
    });

    addDongMarker(polygon.code, map, markersRef);
  });

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
