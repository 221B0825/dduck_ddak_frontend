import React, { useEffect, useRef } from "react";
import { createGuPolygon, createDefaultGuPolygon, addGuMarker } from "./guPolygonHandler";
import { createDongPolygon, addDongMarker } from "./dongPolygonHandler";
import dongAreaData from "../../apis/dong.json";
import guAreaData from "../../apis/gu.json";

const KakaoMap = ({ setSelectedArea, selectQuery, baseArea, compareArea }) => {
  const selectedPolygonRef = useRef(null);
  const mapRef = useRef(null);
  const dongPolygonsRef = useRef([]);
  const guPolygonsRef = useRef([]);
  const defaultGuPolygonsRef = useRef([]); // 기본 구 폴리곤을 저장할 Ref
  const markersRef = useRef([]);

  useEffect(() => {
    const kakaoAPI = import.meta.env.VITE_KAKAO_MAP_API_KEY;
    const script = document.createElement("script");
    script.onload = () => initMap();
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoAPI}&autoload=false`;
    document.head.appendChild(script);

    const initMap = () => {
      kakao.maps.load(() => {
        const mapContainer = document.getElementById("map"),
          mapOption = {
            center: new kakao.maps.LatLng(37.532527, 126.99049),
            level: 6, // 초기 줌 레벨 설정
          };

        const map = new kakao.maps.Map(mapContainer, mapOption);
        mapRef.current = map;

        // 기본 구 폴리곤 생성
        guAreaData.forEach((area) => {
          const polygon = createDefaultGuPolygon(area, map);
          defaultGuPolygonsRef.current.push(polygon);
        });

        dongAreaData.forEach((area) => {
          const polygon = createDongPolygon(
            area,
            map,
            setSelectedArea,
            markersRef,
            selectedPolygonRef
          );
          dongPolygonsRef.current.push(polygon);
        });

        guAreaData.forEach((area) => {
          const polygon = createGuPolygon(
            area,
            map,
            setSelectedArea,
            markersRef,
            selectedPolygonRef
          );
          guPolygonsRef.current.push(polygon);
        });

        updatePolygonsVisibility();

        // 지도 레벨 변경 시 폴리곤 가시성 업데이트
        kakao.maps.event.addListener(map, "zoom_changed", () => {
          updatePolygonsVisibility();
          // 현재 선택된 폴리곤이 있으면 그 폴리곤의 색상을 다시 설정
          if (selectedPolygonRef.current) {
            selectedPolygonRef.current.setMap(mapRef.current);
          }
        });
      });
    };

    const updatePolygonsVisibility = () => {
      const mapLevel = mapRef.current.getLevel(); // 현재 지도 레벨을 가져옵니다.

      dongPolygonsRef.current.forEach(
        (p) => p.setMap(mapLevel <= 6 ? mapRef.current : null) // 줌 레벨이 6 이하일 때만 행정동 폴리곤을 표시
      );
      guPolygonsRef.current.forEach(
        (p) => p.setMap(mapLevel > 6 ? mapRef.current : null) // 줌 레벨이 6 초과일 때만 구 폴리곤을 표시
      );
    };

    return () => {
      dongPolygonsRef.current = [];
      guPolygonsRef.current = [];
      defaultGuPolygonsRef.current.forEach((p) => p.setMap(null)); // 기본 폴리곤 제거
      markersRef.current.forEach((marker) => marker.setMap(null));
      if (mapRef.current) {
        document.getElementById("map").innerHTML = "";
      }
    };
  }, []);

  useEffect(() => {
    if (baseArea && compareArea) {
      const basePolygon = dongPolygonsRef.current.find(
        (p) => p.code === baseArea.code
      );
      const comparePolygon = dongPolygonsRef.current.find(
        (p) => p.code === compareArea.code
      );

      if (basePolygon) {
        basePolygon.setOptions({ fillColor: "#09f", strokeWeight: 2 });
      }

      if (comparePolygon) {
        comparePolygon.setOptions({ fillColor: "red", strokeWeight: 2 });
      }
    }
  }, [baseArea, compareArea]);

  useEffect(() => {
    if (!mapRef.current || !selectQuery) return;

    let polygonsRef =
      selectQuery.type === "dongCode" ? dongPolygonsRef : guPolygonsRef;
    let targetPolygon = polygonsRef.current.find(
      (p) => p.code === selectQuery.data
    );

    if (targetPolygon) {
      if (selectedPolygonRef.current) {
        selectedPolygonRef.current.setOptions({
          fillColor: "none",
          strokeWeight: 0,
        });
        selectedPolygonRef.current.setMap(null);
        selectedPolygonRef.current.setMap(mapRef.current);
      }

      targetPolygon.setOptions({ fillColor: "#09f", strokeWeight: 2 });
      targetPolygon.setMap(null);
      targetPolygon.setMap(mapRef.current);

      selectedPolygonRef.current = targetPolygon;
      const bounds = new kakao.maps.LatLngBounds();
      targetPolygon.getPath().forEach((point) => bounds.extend(point));
      mapRef.current.setBounds(bounds);
      mapRef.current.setLevel(selectQuery.type === "dongCode" ? 4 : 6);

      setSelectedArea({
        name: targetPolygon.areaName,
        code: targetPolygon.code,
        type: selectQuery.type,
        calculatedArea: Math.floor(targetPolygon.getArea()),
      });

      if (selectQuery.type === "dongCode") {
        addDongMarker(targetPolygon.code, mapRef.current, markersRef);
      } else {
        addGuMarker(targetPolygon.code, mapRef.current, markersRef);
      }
    }
  }, [selectQuery]);

  return <div id="map" style={{ width: "100%", height: "950px" }}></div>;
};

export default KakaoMap;
