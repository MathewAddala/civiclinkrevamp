import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import L from 'leaflet'; 
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { issueService } from '../services/issueService.js';

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
    const [issues, setIssues] = useState([]);
    
    // Most stable, key-free tile layer URL
    const FINAL_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

    useEffect(() => {
        const loadIssues = async () => {
            try {
                const response = await issueService.list();
                const rows = Array.isArray(response) ? response : (response?.data || []);
                setIssues(rows);
            } catch {
                setIssues([]);
            }
        };

        loadIssues();
    }, []);

    const issueSpots = useMemo(() => {
        return issues
            .filter((item) => String(item.status || '').toLowerCase() !== 'resolved')
            .filter((item) => Number.isFinite(Number(item.lat)) && Number.isFinite(Number(item.lng)))
            .map((item) => ({
                id: item.id || Math.random().toString(36),
                title: item.title || item.description || 'Issue',
                priority: item.priority || 'Low',
                lat: Number(item.lat),
                lng: Number(item.lng),
                color:
                    item.priority === 'High'
                        ? 'red'
                        : item.priority === 'Medium'
                            ? 'yellow'
                            : 'blue',
            }));
    }, [issues]);

    return (
        <motion.div 
            className="w-full h-screen absolute inset-0 bg-transparent" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
        >
            <div className="absolute top-0 left-0 right-0 z-50 p-4 bg-transparent backdrop-blur-md border-b border-white/5 flex items-center shadow-lg" style={{ height: '64px' }}>
                <motion.button 
                    onClick={() => navigate(-1)}
                    className="flex items-center px-3 py-2 text-white rounded-xl hover:bg-white/10 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ArrowLeft size={20} className="mr-2"/> Back to Dashboard
                </motion.button>
                <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 ml-6 tracking-tight font-orbitron">
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
                    const priorityTextColor =
                        spot.color === 'red' ? 'text-red-600' : spot.color === 'yellow' ? 'text-orange-600' : 'text-blue-600';
                    return (
                        <Marker 
                            key={spot.id} 
                            position={[spot.lat, spot.lng]} 
                            icon={icon}
                        >
                            <Popup>
                                <div className="text-gray-900 font-inter">
                                    <p className="font-bold text-lg">{spot.title}</p>
                                    <p className={`text-sm font-semibold ${priorityTextColor}`}>Priority: {spot.priority}</p>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </motion.div>
    );
}