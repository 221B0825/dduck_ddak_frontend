import React, { useEffect } from 'react';
import areaData from '/public/dongCenterTest.json';  // Ensure this path matches the location of the JSON file

const KakaoMarkerMap = () => {
    useEffect(() => {
        const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;
        const script = document.createElement('script');
        script.onload = () => initMap();
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
        document.head.appendChild(script);

        const initMap = () => {
            kakao.maps.load(() => {
                const mapContainer = document.getElementById('map'),
                      mapOption = {
                          center: new kakao.maps.LatLng(37.566826, 126.9786567),
                          level: 8
                      };
                
                const map = new kakao.maps.Map(mapContainer, mapOption),
                      infowindow = new kakao.maps.InfoWindow({removable: true});

                // 마커를 생성하고 지도에 표시하는 함수
                areaData.forEach(area => {
                    displayMarker(area, map, infowindow);
                });
            });
        };
    }, []);

    const displayMarker = (area, map, infowindow) => {
        const markerPosition  = new kakao.maps.LatLng(area.lat, area.lng);
        const marker = new kakao.maps.Marker({
            position: markerPosition
        });

        marker.setMap(map);

        kakao.maps.event.addListener(marker, 'click', function() {
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
