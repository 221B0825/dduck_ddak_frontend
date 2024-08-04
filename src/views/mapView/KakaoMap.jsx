import React, { useEffect, useRef } from "react";
import axios from "axios";
import dongAreaData from "../../apis/dong.json";
import guAreaData from "../../apis/gu.json";
import dongChartData from "../../apis/dong_consumption_test.json";
import guChartData from "../../apis/gu_consumption_test.json";

const KakaoMap = ({ isSelectedSize, setSelectedArea, selectQuery }) => {
  const selectedPolygonRef = useRef(null);
  const mapRef = useRef(null);
  const dongPolygonsRef = useRef([]);
  const guPolygonsRef = useRef([]);
  const defaultPolygonsRef = useRef([]);

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
            level: 6,
          };

        const map = new kakao.maps.Map(mapContainer, mapOption);
        mapRef.current = map;

        dongAreaData.forEach((area) => {
          const polygon = createPolygon(area, map, "dong");
          dongPolygonsRef.current.push(polygon);
        });

        guAreaData.forEach((area) => {
          const polygon = createPolygon(area, map, "gu");
          guPolygonsRef.current.push(polygon);
        });

        guAreaData.forEach((area) => {
          const polygon = createDefaultPolygon(area, map);
          defaultPolygonsRef.current.push(polygon);
        });

        updatePolygonsVisibility();
      });
    };

    const createDefaultPolygon = (area, map) => {
      const path = area.path.map(
        (coords) => new kakao.maps.LatLng(coords.lat, coords.lng)
      );

      const polygon = new kakao.maps.Polygon({
        map: map,
        path: path,
        strokeWeight: 3, // 기본 스타일 설정
        strokeColor: "#000000",
        strokeOpacity: 0.2,
        fillColor: "#D9D9D9",
        fillOpacity: 0.2,
        zIndex: 1, // 최하위 층에 위치
      });

      return polygon;
    };

    const createPolygon = (area, map, type) => {
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
        zIndex: type === "dong" ? 10 : 5,
      });

      // 폴리곤 객체에 추가 정보 저장
      polygon.areaCode = type === "dong" ? area.adm_cd : area.ssg_cd;
      polygon.areaName = area.name;

      kakao.maps.event.addListener(
        polygon,
        "click",
        async function (mouseEvent) {
          if (selectedPolygonRef.current) {
            selectedPolygonRef.current.setOptions({
              fillColor: "#fff",
              strokeWeight: 0,
            });
          }

          polygon.setOptions({
            fillColor: "#09f",
            strokeWeight: 2,
          });

          selectedPolygonRef.current = polygon;
          const areaCode = type === "dong" ? area.adm_cd : area.ssg_cd;
          let additionalData = null;

          try {
            const response = await axios.get(
              `https://gadduck.info/towns/populations/floating/quarter?code=${areaCode}`
            );
            additionalData = response.data;
            console.log(additionalData);
          } catch (error) {
            console.error("Failed to fetch area data", error);
          }

          setSelectedArea({
            name: polygon.areaName,
            code: polygon.areaCode,
            type: type,
            calculatedArea: Math.floor(polygon.getArea()),
            additionalData: additionalData,
          });
        }
      );

      return polygon;
    };

    const updatePolygonsVisibility = () => {
      dongPolygonsRef.current.forEach((polygon) =>
        polygon.setMap(isSelectedSize ? mapRef.current : null)
      );
      guPolygonsRef.current.forEach((polygon) =>
        polygon.setMap(isSelectedSize ? null : mapRef.current)
      );
    };

    return () => {
      dongPolygonsRef.current = [];
      guPolygonsRef.current = [];
      defaultPolygonsRef.current.forEach((polygon) => polygon.setMap(null)); // 메모리 정리
      if (mapRef.current) {
        const mapContainer = document.getElementById("map");
        mapContainer.innerHTML = "";
      }
    };
  }, [isSelectedSize]);

  useEffect(() => {
    console.log("동 set: ", selectQuery, selectQuery.type, selectQuery.data);
    if (!mapRef.current || !selectQuery) return;

    let polygonsRef =
      selectQuery.type === "dongCode" ? dongPolygonsRef : guPolygonsRef;

    console.log("polygon: ", polygonsRef);

    let targetPolygon = polygonsRef.current.find((p) => {
      return p.areaCode === selectQuery.data;
    });

    console.log("target: ", targetPolygon);

    if (targetPolygon) {
      // 선택한 폴리곤 클릭 효과 적용
      if (selectedPolygonRef.current) {
        selectedPolygonRef.current.setOptions({
          fillColor: "#fff", // 원래 색으로 초기화
          strokeWeight: 0,
        });
      }

      targetPolygon.setOptions({
        fillColor: "#09f",
        strokeWeight: 2,
        zIndex: 100, // zIndex를 높여 상위에 표시
      });

      selectedPolygonRef.current = targetPolygon;
      console.log("색 변경 후 폴리곤:", targetPolygon);

      // 지도 중심 이동
      const bounds = new kakao.maps.LatLngBounds();
      const path = targetPolygon.getPath();
      path.forEach(function (point) {
        bounds.extend(point);
      });
      mapRef.current.setBounds(bounds); // 경계 설정
      mapRef.current.setLevel(5); // 지도 레벨 설정

      // 선택 지역 정보 업데이트
      setSelectedArea({
        name: targetPolygon.areaName,
        code: targetPolygon.areaCode,
        type: selectQuery.type,
        calculatedArea: Math.floor(targetPolygon.getArea()),
      });
    }
  }, [selectQuery]);

  return <div id="map" style={{ width: "100%", height: "1000px" }}></div>;
};

export default KakaoMap;
