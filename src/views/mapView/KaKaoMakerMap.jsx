import React, { useEffect } from 'react';
import areaData from '../../apis/dongCenter.json';

const KakaoMarkerMap = () => {
    useEffect(() => {
        const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY; // 환경 변수에서 API 키 로드
        const script = document.createElement('script');
        script.onload = () => initMap();
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false&libraries=services`;
        document.head.appendChild(script);

        function initMap() {
            kakao.maps.load(() => {
                const mapContainer = document.getElementById('map'),
                      mapOption = {
                          center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 초기 중심 좌표
                          level: 8  // 지도의 확대 레벨
                      };

                const map = new kakao.maps.Map(mapContainer, mapOption),
                      infowindow = new kakao.maps.InfoWindow({removable: true});

                // 마커와 정보창을 생성하고 지도에 표시
                areaData.forEach(area => {
                    displayMarker(area, map, infowindow);
                });
            });
        }
    }, []);

    const displayMarker = (area, map, infowindow) => {
        const markerPosition  = new kakao.maps.LatLng(area.lat, area.lng);
        const marker = new kakao.maps.Marker({
            position: markerPosition
        });

        marker.setMap(map);

        kakao.maps.event.addListener(marker, 'click', () => {
            const content = `<div class="info">
                <div class="title">${area.name}</div>
                <div class="details">Code: ${area.adm_cd}</div>
            </div>`;

            infowindow.setContent(content);
            infowindow.setPosition(markerPosition);
            infowindow.setMap(map);
        });
    };

    return <div id="map" style={{ width: '100%', height: '1000px' }}></div>;
};

export default KakaoMarkerMap;
