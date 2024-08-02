import React, { useEffect } from 'react';
import areaData from '/src/apis/dong.json';

const KakaoMap = () => {
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
                      customOverlay = new kakao.maps.CustomOverlay({}),
                      infowindow = new kakao.maps.InfoWindow({removable: true});
                
                areaData.forEach(area => {
                    displayArea(area, map, customOverlay, infowindow);
                });
            });
        };
    }, []);

    const displayArea = (area, map, customOverlay, infowindow) => {
        const path = area.path.map(coords => new kakao.maps.LatLng(coords.lat, coords.lng));
        
        const polygon = new kakao.maps.Polygon({
            map: map,
            path: path,
            strokeWeight: 2,
            strokeColor: '#004c80',
            strokeOpacity: 0.8,
            fillColor: '#fff',
            fillOpacity: 0.7
        });

        kakao.maps.event.addListener(polygon, 'mouseover', function(mouseEvent) {
            polygon.setOptions({fillColor: '#09f'});
            customOverlay.setContent(`<div class="area">${area.name}</div>`);
            customOverlay.setPosition(mouseEvent.latLng); 
            customOverlay.setMap(map);
        });

        kakao.maps.event.addListener(polygon, 'mousemove', function(mouseEvent) {
            customOverlay.setPosition(mouseEvent.latLng);
        });

        kakao.maps.event.addListener(polygon, 'mouseout', function() {
            polygon.setOptions({fillColor: '#fff'});
            customOverlay.setMap(null);
        });

        kakao.maps.event.addListener(polygon, 'click', function(mouseEvent) {
            const content = `<div class="info">
                <div class="title">${area.name}</div>
                <div class="details">Code: ${area.adm_cd}</div>
                <div class="size">Total area: approx ${Math.floor(polygon.getArea())} m²</div>
            </div>`;

            infowindow.setContent(content);
            infowindow.setPosition(mouseEvent.latLng); 
            infowindow.setMap(map);
        });
    };

    return <div id="map" style={{ width: '100%', height: '1000px' }}></div>;
};

export default KakaoMap;