import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../styles/UserLocationMap.css';

mapboxgl.accessToken =
  'pk.eyJ1IjoiYWRhcnNoLXNoYXJtYTYyMTgiLCJhIjoiY2t2bHA5bDZuMDMzNjJ3cjJjYzNuNG1ieCJ9.QdNHT48FzKYo-MW9BsMUDA';

const MapComponent = () => {
  const navigate = useNavigate();
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [isLocationOn, setIsLocationOn] = useState(true);
  const [nearbyPeople, setNearbyPeople] = useState([
    {
      id: 1,
      affiliation: 'Uber',
      interests: 'Music',
      age: '20-25',
      pronouns: 'he/him',
    },
    {
      id: 2,
      affiliation: 'MIT',
      interests: 'CS and funny websites',
      age: '25-30',
      pronouns: 'she/her',
    },
    {
      id: 3,
      affiliation: 'Grinnell College',
      interests: 'Philosphy and English',
      age: '15-20',
      pronouns: 'they/them',
    },
  ]);
  const radiusInMeters = 1609.34; // 1 mile in meters

  useEffect(() => {
    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-74.5, 40],
      zoom: 12,
    });

    mapInstance.on('load', () => {
      setMap(mapInstance);
    });

    return () => mapInstance.remove();
  }, []);

  useEffect(() => {
    if (map && isLocationOn) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map);
          map.setCenter([longitude, latitude]);

          const circleFeature = {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                getCircleCoordinates([longitude, latitude], radiusInMeters),
              ],
            },
          };

          if (!map.getSource('circle')) {
            map.addSource('circle', {
              type: 'geojson',
              data: circleFeature,
            });

            map.addLayer({
              id: 'circle-radius',
              type: 'fill',
              source: 'circle',
              paint: {
                'fill-color': '#007cbf',
                'fill-opacity': 0.3,
              },
            });
          } else {
            map.getSource('circle').setData(circleFeature);
          }
        },
        (error) => {
          console.error('Error fetching user location:', error);
        }
      );
    } else if (map && !isLocationOn) {
      // Remove the marker and circle when location is turned off
      if (map.getLayer('circle-radius')) {
        map.removeLayer('circle-radius');
      }
      if (map.getSource('circle')) {
        map.removeSource('circle');
      }
    }
  }, [map, isLocationOn]);

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
    coords.push(coords[0]);
    return coords;
  };

  const handleAction = (person) => {
    console.log(
      `${person.actionType} clicked for person from ${person.affiliation}`
    );
  };

  const handleReceivedRequests = () => {
    navigate('/requestedMeetups');
  };

  const toggleLocation = () => {
    setIsLocationOn((prevState) => !prevState);
    // backend logic
  };

  return (
    <div className="map-component">
      <div ref={mapContainerRef} className="map-container" />
      <div className="people-list">
        <div className="people-list-header">
          <h3>Choose a person</h3>
          <div className="button-group">
            <button onClick={toggleLocation} className="location-toggle-button">
              Location: {isLocationOn ? 'On' : 'Off'}
            </button>
            <button
              onClick={handleReceivedRequests}
              className="received-requests-button"
            >
              Received Requests
            </button>
          </div>
        </div>
        {nearbyPeople.map((person) => (
          <div key={person.id} className="person-card">
            <div className="person-info">
              <h4>1 Person from {person.affiliation}</h4>
              <p className="details">
                {person.pronouns} • {person.age}
              </p>
              <p>Interested in {person.interests}</p>
            </div>
            <button
              onClick={() => handleAction(person)}
              className="action-button"
            >
              Request Meetup
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapComponent;
