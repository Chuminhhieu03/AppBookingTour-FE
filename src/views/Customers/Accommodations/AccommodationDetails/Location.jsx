import React from 'react';
import { MapContainer, TileLayer, Marker as LeafletMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function Location({ accommodation }) {
    const coords = accommodation?.coordinates?.split(',').map((c) => parseFloat(c.trim()));
    const center = coords && coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1]) ? coords : [21.0285, 105.8542];

    return (
        <div>
            <h4 className="fw-bold mb-3">VỊ TRÍ</h4>
            <div className="border rounded" style={{ height: '300px', overflow: 'hidden' }}>
                <MapContainer
                    center={center}
                    zoom={13}
                    scrollWheelZoom={false}
                    style={{ height: '100%', width: '100%' }}
                    key={accommodation?.coordinates || 'default'}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LeafletMarker position={center}>
                        <Popup>{accommodation?.name}</Popup>
                    </LeafletMarker>
                </MapContainer>
            </div>
        </div>
    );
}

export default Location;
