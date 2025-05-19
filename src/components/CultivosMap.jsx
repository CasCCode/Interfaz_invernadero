import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function AddMarkerOnClick({ activeMarkerType, addMarker }) {
  useMapEvent('click', (e) => {
    if (activeMarkerType) {
      addMarker(e.latlng, activeMarkerType);
    }
  });
  return null;
}

function CultivosMap({ plantingLocation }) {
  const [position, setPosition] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [activeMarkerType, setActiveMarkerType] = useState(null);
  useEffect(() => {
    if (plantingLocation) {
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
          plantingLocation
        )}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data && data.length > 0) {
            setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
          }
        })
        .catch((error) =>
          console.error('Error al geocodificar la ubicación:', error)
        );
    }
  }, [plantingLocation]);
  const addMarker = (latlng, type) => {
    setMarkers((prev) => [
      ...prev,
      { id: Date.now(), type, position: [latlng.lat, latlng.lng] },
    ]);
    setActiveMarkerType(null); 
  };
  const markerIconByType = (type) => {
    let emoji = "";
    switch (type) {
      case "nuevos":
        emoji = "🌱";
        break;
      case "maduros":
        emoji = "🟫";
        break;
      case "incidencias":
        emoji = "⚠️";
        break;
      default:
        emoji = "📍"; 
    }
    return L.divIcon({
      html: `<div style="font-size: 2rem; line-height: 1;">${emoji}</div>`,
      className: 'custom-div-icon', 
      iconSize: [30, 30],
      iconAnchor: [15, 30]
    });
  };

  if (!position) {
    return <p>Cargando mapa...</p>;
  }

  return (
    <div>
      <div style={{ marginBottom: '10px', textAlign: 'center' }}>
        <span style={{ marginRight: '10px' }}>Agregar marcador:</span>
        <button
          onClick={() => setActiveMarkerType('nuevos')}
          style={{
            marginRight: '5px',
            backgroundColor: activeMarkerType === 'nuevos' ? '#c8e6c9' : '',
          }}
        >
          🌱
        </button>
        <button
          onClick={() => setActiveMarkerType('maduros')}
          style={{
            marginRight: '5px',
            backgroundColor: activeMarkerType === 'maduros' ? '#ffe0b2' : '',
          }}
        >
          🟫
        </button>
        <button
          onClick={() => setActiveMarkerType('incidencias')}
          style={{
            backgroundColor: activeMarkerType === 'incidencias' ? '#fff9c4' : '',
          }}
        >
          ⚠️
        </button>
        {activeMarkerType && (
          <span style={{ marginLeft: '10px', fontStyle: 'italic' }}>
            Click en el mapa para colocar el marcador
          </span>
        )}
      </div>
      <MapContainer center={position} zoom={15} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>Ubicación principal: {plantingLocation}</Popup>
        </Marker>
        {markers.map((m) => (
          <Marker key={m.id} position={m.position} icon={markerIconByType(m.type)}>
            <Popup>
              {m.type === 'nuevos' && '🌱 Zona de nuevos cultivos'}
              {m.type === 'maduros' && '🟫 Zona de cultivos maduros'}
              {m.type === 'incidencias' && '⚠️ Zonas con incidencias'}
            </Popup>
          </Marker>
        ))}
        <AddMarkerOnClick activeMarkerType={activeMarkerType} addMarker={addMarker} />
      </MapContainer>
    </div>
  );
}

export default CultivosMap;