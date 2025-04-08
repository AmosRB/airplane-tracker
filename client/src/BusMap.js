import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

const BusMap = () => {
  const [planes, setPlanes] = useState([]);

  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        const res = await fetch('https://opensky-network.org/api/states/all');
        const data = await res.json();

        const filtered = data.states.filter(p => {
          const lat = p[6];
          const lon = p[5];
          return lat && lon && lat > 29 && lat < 34.5 && lon > 33 && lon < 36;
        });

        setPlanes(filtered);
      } catch (err) {
        console.error('שגיאה בטעינת נתוני מטוסים', err);
      }
    };

    fetchPlanes();
    const interval = setInterval(fetchPlanes, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MapContainer center={[31.5, 34.8]} zoom={7} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {planes.map((p, index) => (
        <Marker key={index} position={[p[6], p[5]]}>
          <Popup>
            <div>
              <strong>מטוס:</strong> {p[1] || 'לא ידוע'}<br />
              <strong>מדינה:</strong> {p[2]}<br />
              <strong>גובה:</strong> {p[7] ? p[7].toFixed(0) + ' מ׳' : '—'}<br />
              <strong>מהירות:</strong> {p[9] ? p[9].toFixed(0) + ' קמ"ש' : '—'}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default BusMap;
