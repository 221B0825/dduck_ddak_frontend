import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import areaData from '../../apis/updated_dong.json';
import chartData from '../../apis/consumption_test.json';

const KakaoMap = ({ setSelectedArea }) => {
  const selectedPolygonRef = useRef(null);

  useEffect(() => {
    const kakaoAPI = import.meta.env.VITE_KAKAO_MAP_API_KEY;
    const seoulAPI = import.meta.env.VITE_SEOUL_PUBLIC_API_KEY;

    const script = document.createElement('script');
    script.onload = () => initMap();
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoAPI}&autoload=false`;
    document.head.appendChild(script);

    const initMap = () => {
      kakao.maps.load(() => {
        const mapContainer = document.getElementById('map'),
          mapOption = {
            center: new kakao.maps.LatLng(37.532527, 126.99049),
            level: 6,
          };

        const map = new kakao.maps.Map(mapContainer, mapOption),
          customOverlay = new kakao.maps.CustomOverlay({}),
          infowindow = new kakao.maps.InfoWindow({ removable: true });

        areaData.forEach((area) => {
          displayArea(area, map, customOverlay, infowindow);
        });
      });
    };

    /**

    const fetchAreaData = async (adm_cd) => {
      try {
         console.log(seoulAPI);
         console.log(adm_cd);
         const response = await axios.get(
          http://openapi.seoul.go.kr:8088/${seoulAPI}/json/VwsmAdstrdNcmCnsmpW/1/1/ADSTRD_CD=${adm_cd}
         );
        const response = chartData;
        return response.data;
      } catch (error) {
        console.error('Failed to fetch area data', error);
        return null;
      }
    }; */

    const fetchAreaData = async (adm_cd) => {
      try {
        const response = chartData;
        const data = response.DATA.find((data) => data.adstrd_cd === adm_cd);
        const labels = Object.values(response.DESCRIPTION);
        const values = Object.keys(response.DESCRIPTION).map(
          (key) => data[key.toLowerCase()]
        );
        return { labels, values, expndtr_totamt: data.expndtr_totamt }; // Include expndtr_totamt
      } catch (error) {
        console.error('Failed to fetch area data', error);
        return null;
      }
    };

    const displayArea = (area, map, customOverlay, infowindow) => {
      const path = area.path.map(
        (coords) => new kakao.maps.LatLng(coords.lat, coords.lng)
      );

      const polygon = new kakao.maps.Polygon({
        map: map,
        path: path,
        strokeWeight: 0, // 초기에는 선을 보이지 않도록 설정
        strokeColor: '#004c80',
        strokeOpacity: 0.8,
        fillColor: '#fff',
        fillOpacity: 0.2,
      });

      kakao.maps.event.addListener(
        polygon,
        'click',
        async function (mouseEvent) {
          if (selectedPolygonRef.current) {
            selectedPolygonRef.current.setOptions({
              fillColor: '#fff',
              strokeWeight: 0, // 클릭 해제 시 선을 보이지 않도록 설정
            });
          }

          polygon.setOptions({
            fillColor: '#09f',
            strokeWeight: 2, // 클릭 시 선을 보이도록 설정
          });

          selectedPolygonRef.current = polygon;

          const additionalData = await fetchAreaData(area.adm_cd);

          const selectedArea = {
            ...area,
            calculatedArea: polygon.getArea(),
            additionalData: additionalData,
          };

          setSelectedArea(selectedArea);

          const content = `<div class="info">
                <div class="title">${area.name}</div>
                <div class="details">Code: ${area.adm_cd}</div>
                <div class="size">Total area: approx ${Math.floor(
                  polygon.getArea()
                )} m²</div>`;

          infowindow.setContent(content);
          infowindow.setPosition(mouseEvent.latLng);
          infowindow.setMap(map);
        }
      );
    };
  }, [setSelectedArea]);

  return <div id="map" style={{ width: '100%', height: '1000px' }}></div>;
};

export default KakaoMap;
