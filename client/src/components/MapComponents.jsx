import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from "framer-motion";
function MapComponent({ data }) {
  const position = [37.0902, -95.7129];
  const zoom = 4;

  return (
    <motion.div
      initial={{ x: -10, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{
        duration: 1.7,
        ease: 'easeOut'
      }}
      className="my-5 overflow-hidden relative z-0">
      <MapContainer center={position} zoom={zoom} className="overflow-visible" style={{ height: '600px', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />

        {data.map(item => (
          <CircleMarker
            key={item.id}
            center={[item.coordinate_x, item.coordinate_y]}
            radius={5}
            pathOptions={{ color: 'blue' }}
          >
            <Popup>
              <strong>{item.animal_name}</strong><br />
              {item.city}, {item.state}<br />
              {new Date(item.created_at).toLocaleString()}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </motion.div>
  );
}

export default MapComponent;
