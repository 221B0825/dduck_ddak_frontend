import React, { useEffect, useRef } from "react";
import axios from "axios";
import dongAreaData from "../../apis/dong.json";
import guAreaData from "../../apis/gu.json";

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
        strokeWeight: 3,
        strokeColor: "#000000",
        strokeOpacity: 0.2,
        fillColor: "#D9D9D9",
        fillOpacity: 0.2,
        zIndex: 1,
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

      polygon.code = type === "dong" ? area.adm_cd : area.name.split(" ")[1];
      polygon.areaName = area.name;

      attachPolygonEvents(polygon, area, type, map);

      return polygon;
    };

    const attachPolygonEvents = (polygon, area, type, map) => {
      kakao.maps.event.addListener(polygon, "click", function () {
        if (selectedPolygonRef.current) {
          selectedPolygonRef.current.setOptions({
            fillColor: "#fff",
            strokeWeight: 0,
          });
        }

        polygon.setOptions({ fillColor: "#09f", strokeWeight: 2 });

        selectedPolygonRef.current = polygon;
        setSelectedArea({
          name: polygon.areaName,
          code: polygon.code,
          type: type,
          calculatedArea: Math.floor(polygon.getArea()),
        });
      });
    };

    const updatePolygonsVisibility = () => {
      dongPolygonsRef.current.forEach((p) =>
        p.setMap(isSelectedSize ? mapRef.current : null)
      );
      guPolygonsRef.current.forEach((p) =>
        p.setMap(isSelectedSize ? null : mapRef.current)
      );
    };

    return () => {
      dongPolygonsRef.current = [];
      guPolygonsRef.current = [];
      defaultPolygonsRef.current.forEach((p) => p.setMap(null));
      if (mapRef.current) {
        document.getElementById("map").innerHTML = "";
      }
    };
  }, [isSelectedSize]);

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
          fillColor: "#fff",
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
      mapRef.current.setLevel(selectQuery.type === "dongCode" ? 5 : 7);

      setSelectedArea({
        name: targetPolygon.areaName,
        code: targetPolygon.code,
        type: selectQuery.type,
        calculatedArea: Math.floor(targetPolygon.getArea()),
      });
    }
  }, [selectQuery]);

  return <div id="map" style={{ width: "100%", height: "950px" }}></div>;
};

export default KakaoMap;
