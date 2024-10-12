import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios"; // Import axios for making API calls

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWRhcnNoLXNoYXJtYTYyMTgiLCJhIjoiY2t2bHA5bDZuMDMzNjJ3cjJjYzNuNG1ieCJ9.QdNHT48FzKYo-MW9BsMUDA"; // Replace with your Mapbox token

const MapComponent = () => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [people, setPeople] = useState([]); // State for storing fetched data
  const radiusInMeters = 1609.34; // 1 mile in meters

  useEffect(() => {
    // Initialize the Mapbox map
    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-74.5, 40],
      zoom: 12,
    });

    setMap(mapInstance);

    return () => mapInstance.remove();
  }, []);

  useEffect(() => {
    if (map) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map);
          map.setCenter([longitude, latitude]);

          const circleFeature = {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                getCircleCoordinates([longitude, latitude], radiusInMeters),
              ],
            },
          };

          map.addSource("circle", {
            type: "geojson",
            data: circleFeature,
          });

          map.addLayer({
            id: "circle-radius",
            type: "fill",
            source: "circle",
            paint: {
              "fill-color": "#007cbf",
              "fill-opacity": 0.3,
            },
          });
        },
        (error) => {
          console.error("Error fetching user location:", error);
        }
      );
    }
  }, [map]);


  const getCircleCoordinates = (center, radiusInMeters) => {
    const points = 64;
    const coords = [];
    const distanceX = radiusInMeters / (111.32 * 1000);
    const distanceY = radiusInMeters / ((40075 * 1000) / 360);

    for (let i = 0; i < points; i++) {
      const angle = (i * 2 * Math.PI) / points;
      const dx = distanceX * Math.cos(angle);
      const dy = distanceY * Math.sin(angle);
      coords.push([center[0] + dx, center[1] + dy]);
    }
    coords.push(coords[0]); // Close the polygon loop
    return coords;
  };

  const handleRowClick = (person) => {
    // Handle row click here
    console.log("Clicked:", person);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div
        ref={mapContainerRef}
        style={{ width: "100%", height: "50%" }} // Map takes 50% height
      />
      <div style={{ height: "50%", overflowY: "auto" }}>
        {" "}
        {/* Scrollable section */}
        {people.map((person) => (
          <div
            key={person.id} // Ensure each row has a unique key
            onClick={() => handleRowClick(person)}
            style={{
              padding: "15px",
              borderBottom: "1px solid #ccc",
              cursor: "pointer",
              backgroundColor: "#f9f9f9",
            }}
          >
            {person.name} {/* Adjust to show the desired properties */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapComponent;
