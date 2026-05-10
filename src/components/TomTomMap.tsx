import React from 'react';
import { WebView } from 'react-native-webview';
import { GOOGLE_MAPS_API_KEY } from '../lib/constants';

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
  hospitalName,
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
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: 100%; height: 100vh; overflow: hidden; }
    #map { width: 100%; height: 100vh; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var centerLat = ${centerLat};
    var centerLng = ${centerLng};
    var hospitalLat = ${hospitalLat !== undefined ? hospitalLat : 'null'};
    var hospitalLng = ${hospitalLng !== undefined ? hospitalLng : 'null'};
    var donorLat = ${donorLat !== undefined ? donorLat : 'null'};
    var donorLng = ${donorLng !== undefined ? donorLng : 'null'};
    var showRoute = ${showRoute ? 'true' : 'false'};
    var donorMarkers = ${donorMarkers && donorMarkers.length > 0 ? JSON.stringify(donorMarkers) : '[]'};

    function initMap() {
      var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: centerLat, lng: centerLng },
        zoom: 13,
        disableDefaultUI: true,
        zoomControl: false
      });

      if (hospitalLat !== null && hospitalLng !== null) {
        new google.maps.Marker({
          position: { lat: hospitalLat, lng: hospitalLng },
          map: map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#e8003d',
            fillOpacity: 1,
            strokeColor: '#fff',
            strokeWeight: 3
          }
        });
      }

      if (donorLat !== null && donorLng !== null) {
        new google.maps.Marker({
          position: { lat: donorLat, lng: donorLng },
          map: map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#1a6bb5',
            fillOpacity: 1,
            strokeColor: '#fff',
            strokeWeight: 3
          }
        });
      }

      donorMarkers.forEach(function(d) {
        new google.maps.Marker({
          position: { lat: d.lat, lng: d.lng },
          map: map,
          label: { text: d.initials, color: '#fff', fontSize: '11px', fontWeight: 'bold' },
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 16,
            fillColor: '#1a6bb5',
            fillOpacity: 1,
            strokeColor: '#fff',
            strokeWeight: 2
          }
        });
      });

      if (donorMarkers.length > 0 && hospitalLat !== null && !showRoute) {
        var bounds = new google.maps.LatLngBounds();
        if (hospitalLat !== null && hospitalLng !== null) bounds.extend({ lat: hospitalLat, lng: hospitalLng });
        donorMarkers.forEach(function(d) { bounds.extend({ lat: d.lat, lng: d.lng }); });
        map.fitBounds(bounds, { top: 60, right: 60, bottom: 60, left: 60 });
      }

      if (showRoute && hospitalLat !== null && hospitalLng !== null && donorLat !== null && donorLng !== null) {
        var ds = new google.maps.DirectionsService();
        var dr = new google.maps.DirectionsRenderer({
          suppressMarkers: true,
          polylineOptions: { strokeColor: '#e8003d', strokeWeight: 4 }
        });
        dr.setMap(map);
        ds.route({
          origin: { lat: donorLat, lng: donorLng },
          destination: { lat: hospitalLat, lng: hospitalLng },
          travelMode: google.maps.TravelMode.DRIVING
        }, function(result, status) {
          if (status === 'OK') {
            dr.setDirections(result);
            var leg = result.routes[0].legs[0];
            var bounds = new google.maps.LatLngBounds();
            bounds.extend({ lat: donorLat, lng: donorLng });
            bounds.extend({ lat: hospitalLat, lng: hospitalLng });
            map.fitBounds(bounds, 60);
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                distKm: (leg.distance.value / 1000).toFixed(1),
                etaMins: Math.round(leg.duration.value / 60)
              }));
            }
          } else {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ error: status }));
            }
          }
        });
      }
    }
  </script>
  <script src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap" async defer></script>
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
