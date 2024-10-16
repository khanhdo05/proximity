import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../styles/UserLocationMap.css';
import GeoService from '../util/GeoService';
import PersonCard from './PersonCard';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import Header from './Header';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const MapComponent = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [isLocationOn, setIsLocationOn] = useState(true);
  const [nearbyPeople, setNearbyPeople] = useState([]);
  const radiusInMeters = 1609.34; // 1 mile in meters

  const updateNearbyPeople = (newPeople) => {
    setNearbyPeople(newPeople);
  };

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

  const handleAction = async ({ personId, actionType }) => {
    if (actionType === 'Request Meetup') {
      try {
        const response = await axios.post(
          'http://localhost:8080/api/user/sendMeetupRequest',
          {
            senderId: user._id,
            receiverId: personId,
            senderLabel: user.currentLabel,
          }
        );
        if (response.data.success) {
          alert('Meetup request sent successfully!');
        } else {
          alert('Failed to send meetup request. Please try again.');
        }
      } catch (error) {
        console.error('Error sending meetup request:', error);
        alert('An error occurred while sending the meetup request.');
      }
    }
  };

  const handleReceivedRequests = () => {
    navigate('/receivedRequests');
  };

  const toggleLocation = async () => {
    setIsLocationOn((prevState) => !prevState);
    try {
      await axios.post('http://localhost:8080/api/user/updateLocationOn', {
        uid: user._id,
        isLocationOn: !isLocationOn,
      });
    } catch (error) {
      console.error('Error updating location status:', error);
    }
  };

  return (
    <>
      <Header />
      <div className="map-component">
        <div ref={mapContainerRef} className="map-container" />
        <div className="people-list">
          <div className="people-list-header">
            <h3>People around you:</h3>
            <div className="button-group">
              <button
                onClick={toggleLocation}
                className="location-toggle-button"
              >
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
          <GeoService
            userid={user._id}
            labelSelector={user.currentLabel}
            setNearbyUsers={updateNearbyPeople}
          />
          {nearbyPeople.length === 0 ? (
            <>
              We will let you know when you have interesting people around you.
            </>
          ) : (
            nearbyPeople.map((person) => (
              <PersonCard
                key={person[0]}
                labelValue={person[1]}
                personId={person[0]}
                onAction={handleAction}
                isInHome={true}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default MapComponent;
