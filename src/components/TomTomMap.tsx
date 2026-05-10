import React from 'react';
import { WebView } from 'react-native-webview';

interface TomTomMapProps {
  height: number;
  centerLat: number;
  centerLng: number;
  hospitalLat?: number;
  hospitalLng?: number;
  hospitalName?: string;
  donorLat?: number;
  donorLng?: number;
  showRoute?: boolean;
  onRouteInfo?: (info: { distKm: string; etaMins: number }) => void;
  donorMarkers?: Array<{ lat: number; lng: number; initials: string; name: string }>;
}

export function TomTomMap({
  height,
  centerLat,
  centerLng,
  hospitalLat,
  hospitalLng,
  donorLat,
  donorLng,
  showRoute,
  onRouteInfo,
  donorMarkers,
}: TomTomMapProps) {
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: 100%; height: 100vh; overflow: hidden; }
    #map { width: 100%; height: 100vh; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    var centerLat = ${centerLat};
    var centerLng = ${centerLng};
    var hospitalLat = ${hospitalLat !== undefined ? hospitalLat : 'null'};
    var hospitalLng = ${hospitalLng !== undefined ? hospitalLng : 'null'};
    var donorLat = ${donorLat !== undefined ? donorLat : 'null'};
    var donorLng = ${donorLng !== undefined ? donorLng : 'null'};
    var showRoute = ${showRoute ? 'true' : 'false'};
    var donorMarkers = ${donorMarkers && donorMarkers.length > 0 ? JSON.stringify(donorMarkers) : '[]'};

    var map = L.map('map', { zoomControl: false, attributionControl: false })
      .setView([centerLat, centerLng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

    function circleIcon(color, size) {
      size = size || 20;
      return L.divIcon({
        html: '<div style="width:' + size + 'px;height:' + size + 'px;border-radius:50%;background:' + color + ';border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>',
        className: '',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
      });
    }

    function initialsIcon(initials, color) {
      return L.divIcon({
        html: '<div style="width:34px;height:34px;border-radius:50%;background:' + color + ';color:white;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:bold;border:2.5px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.35);">' + initials + '</div>',
        className: '',
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });
    }

    if (hospitalLat !== null && hospitalLng !== null) {
      L.marker([hospitalLat, hospitalLng], { icon: circleIcon('#e8003d') }).addTo(map);
    }

    if (donorLat !== null && donorLng !== null) {
      L.marker([donorLat, donorLng], { icon: circleIcon('#1a6bb5') }).addTo(map);
    }

    donorMarkers.forEach(function(d) {
      L.marker([d.lat, d.lng], { icon: initialsIcon(d.initials, '#1a6bb5') }).addTo(map);
    });

    if (donorMarkers.length > 0 && hospitalLat !== null && !showRoute) {
      var coords = donorMarkers.map(function(d) { return [d.lat, d.lng]; });
      coords.push([hospitalLat, hospitalLng]);
      map.fitBounds(L.latLngBounds(coords), { padding: [60, 60] });
    }

    if (showRoute && hospitalLat !== null && donorLat !== null) {
      fetch(
        'https://router.project-osrm.org/route/v1/driving/' +
        donorLng + ',' + donorLat + ';' +
        hospitalLng + ',' + hospitalLat +
        '?overview=full&geometries=geojson'
      )
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (!data.routes || !data.routes[0]) {
          map.fitBounds([[donorLat, donorLng], [hospitalLat, hospitalLng]], { padding: [60, 60] });
          return;
        }
        var route = data.routes[0];
        L.geoJSON(route.geometry, {
          style: { color: '#e8003d', weight: 5, opacity: 0.9 }
        }).addTo(map);
        var coords = route.geometry.coordinates.map(function(c) { return [c[1], c[0]]; });
        map.fitBounds(L.latLngBounds(coords), { padding: [60, 60] });
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            distKm: (route.distance / 1000).toFixed(1),
            etaMins: Math.round(route.duration / 60)
          }));
        }
      })
      .catch(function() {
        map.fitBounds([[donorLat, donorLng], [hospitalLat, hospitalLng]], { padding: [60, 60] });
      });
    }
  </script>
</body>
</html>`;

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html, baseUrl: 'https://localhost' }}
      style={{ width: '100%', height, borderRadius: 12, overflow: 'hidden' }}
      javaScriptEnabled
      domStorageEnabled
      onMessage={(event) => {
        if (onRouteInfo) {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.distKm && data.etaMins) onRouteInfo(data);
          } catch (_) {}
        }
      }}
    />
  );
}
