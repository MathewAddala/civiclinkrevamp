// src/pages/MapViewPage.jsx
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import L from 'leaflet'; 
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// 🌟 CRITICAL FIX 1: Leaflet Icon Redefinition 🌟
// This prevents default marker loading failure.
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});
// ---------------------------------------------

// KL University coordinates: Latitude ~16.44N, Longitude ~80.62E
const KL_UNIVERSITY_CENTER = [16.4427, 80.6228]; 
const MAP_ZOOM = 16; 

// Mock issue data
const issueSpots = [
    { id: 1, title: "Water Leak near Hostel", priority: 'High', lat: 16.4420, lng: 80.6210, color: 'red' },
    { id: 2, title: "Outage near Main Gate", priority: 'Medium', lat: 16.4450, lng: 80.6240, color: 'yellow' },
    { id: 3, title: "Pothole on Campus Road", priority: 'High', lat: 16.4435, lng: 80.6235, color: 'red' },
    { id: 4, title: "Waste overflow", priority: 'Low', lat: 16.4410, lng: 80.6230, color: 'blue' },
];

// Helper to create custom colored dots (simulating heat)
const createCustomIcon = (color) => {
    return new L.DivIcon({
        className: `custom-map-marker-${color}`,
        html: `<div style="width:12px; height:12px; border-radius:50%; background-color:${color}; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 16],
        popupAnchor: [0, -8],
    });
};

const customIcons = {
    red: createCustomIcon('red'),
    yellow: createCustomIcon('orange'), 
    blue: createCustomIcon('blue'),
};

// 🌟 CRITICAL FIX 2: Map Redrawer Component (Forces correct sizing) 🌟
const MapRedrawer = () => {
    const map = useMap();
    useEffect(() => {
        // Forces the map to recalculate its dimensions immediately upon mount
        map.invalidateSize(); 
    }, [map]); 
    return null;
};
// -------------------------------------------------------------

export default function MapViewPage() {
    const navigate = useNavigate();
    
    // Most stable, key-free tile layer URL
    const FINAL_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

    return (
        <motion.div 
            className="w-full h-screen absolute inset-0 bg-gray-950" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
        >
            <div className="absolute top-0 left-0 right-0 z-50 p-4 bg-gray-900/90 flex items-center shadow-lg border-b border-gray-700" style={{ height: '64px' }}>
                <motion.button 
                    onClick={() => navigate(-1)}
                    className="flex items-center px-3 py-2 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ArrowLeft size={20} className="mr-2"/> Back to Dashboard
                </motion.button>
                <h1 className="text-2xl font-extrabold text-white ml-6 font-orbitron">
                    Final Issue Map View
                </h1>
            </div>
            
            <MapContainer 
                center={KL_UNIVERSITY_CENTER} 
                zoom={MAP_ZOOM} 
                scrollWheelZoom={true} 
                className="w-full h-full"
                style={{ marginTop: '64px' }} 
            >
                {/* Redrawer is essential for full-page views */}
                <MapRedrawer /> 

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
                    url={FINAL_URL}
                />
                
                {issueSpots.map(spot => {
                    const icon = customIcons[spot.color] || customIcons.blue;
                    return (
                        <Marker 
                            key={spot.id} 
                            position={[spot.lat, spot.lng]} 
                            icon={icon}
                        >
                            <Popup>
                                <div className="text-gray-900 font-inter">
                                    <p className="font-bold text-lg">{spot.title}</p>
                                    <p className={`text-sm font-semibold text-${spot.color}-600`}>Priority: {spot.priority}</p>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </motion.div>
    );
}