import React from 'react';
import { WebView } from 'react-native-webview';
import { TOMTOM_API_KEY } from '../lib/constants';

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
}

export function TomTomMap({
  height,
  centerLat,
  centerLng,
  hospitalLat,
  hospitalLng,
  hospitalName,
  donorLat,
  donorLng,
  showRoute,
  onRouteInfo,
}: TomTomMapProps) {
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" type="text/css" href="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.1/maps/maps.css" />
  <script src="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.1/maps/maps-web.min.js"></script>
  <script src="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.1/services/services-web.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: 100%; height: 100vh; overflow: hidden; }
    #map { width: 100%; height: 100vh; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var API_KEY = '${TOMTOM_API_KEY}';
    var centerLat = ${centerLat};
    var centerLng = ${centerLng};
    var hospitalLat = ${hospitalLat !== undefined ? hospitalLat : 'null'};
    var hospitalLng = ${hospitalLng !== undefined ? hospitalLng : 'null'};
    var hospitalName = ${hospitalName ? JSON.stringify(hospitalName) : 'null'};
    var donorLat = ${donorLat !== undefined ? donorLat : 'null'};
    var donorLng = ${donorLng !== undefined ? donorLng : 'null'};
    var showRoute = ${showRoute ? 'true' : 'false'};

    var map = tt.map({
      key: API_KEY,
      container: 'map',
      center: [centerLng, centerLat],
      zoom: 13,
    });

    function createMarkerEl(color) {
      var el = document.createElement('div');
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = color;
      el.style.border = '3px solid #fff';
      el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.4)';
      return el;
    }

    if (hospitalLat !== null && hospitalLng !== null) {
      new tt.Marker({ element: createMarkerEl('#e8003d') })
        .setLngLat([hospitalLng, hospitalLat])
        .addTo(map);
    }

    if (donorLat !== null && donorLng !== null) {
      new tt.Marker({ element: createMarkerEl('#1a6bb5') })
        .setLngLat([donorLng, donorLat])
        .addTo(map);
    }

    if (showRoute && hospitalLat !== null && hospitalLng !== null && donorLat !== null && donorLng !== null) {
      map.on('load', function() {
        tt.services.calculateRoute({
          key: API_KEY,
          locations: donorLng + ',' + donorLat + ':' + hospitalLng + ',' + hospitalLat,
        }).then(function(result) {
          var geojson = result.toGeoJson();
          var summary = result.routes[0].summary;
          var distKm = (summary.lengthInMeters / 1000).toFixed(1);
          var etaMins = Math.round(summary.travelTimeInSeconds / 60);

          map.addSource('route', { type: 'geojson', data: geojson });
          map.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: { 'line-color': '#e8003d', 'line-width': 4 },
          });

          var bounds = new tt.LngLatBounds();
          bounds.extend([donorLng, donorLat]);
          bounds.extend([hospitalLng, hospitalLat]);
          map.fitBounds(bounds, { padding: 60 });

          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              distKm: distKm,
              etaMins: etaMins,
            }));
          }
        }).catch(function(err) {
          console.error('Route error:', err);
        });
      });
    }
  </script>
</body>
</html>`;

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html }}
      style={{ width: '100%', height, borderRadius: 12, overflow: 'hidden' }}
      javaScriptEnabled
      domStorageEnabled
      onMessage={(event) => {
        if (onRouteInfo) {
          try {
            const info = JSON.parse(event.nativeEvent.data);
            onRouteInfo(info);
          } catch (_) {
            // ignore parse errors
          }
        }
      }}
    />
  );
}
