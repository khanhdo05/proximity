import { useEffect, useState } from 'react';
import axios from 'axios';
import PersonCard from '../components/PersonCard';

const ReceivedRequests = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceivedRequests = async () => {
      try {
        const response = await axios.post(
          'http://localhost:8080/api/user/receivedRequests',
          {
            uid: 'user-id', // Replace with actual user ID
            longitude: 'user-longitude', // Replace with actual longitude
            latitude: 'user-latitude', // Replace with actual latitude
            labelSelector: 'label-selector', // Replace with actual label selector
            timestamp: Date.now(),
          }
        );
        setPeople(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching received requests:', error);
        setLoading(false);
      }
    };

    fetchReceivedRequests().then(() => {
      console.log('Received requests fetched');
    });
  }, []);

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="received-requests">
      <h3>Received Requests</h3>
      {people.length === 0 ? (
        <p>Wop wop no one wants to chat. Send requests to people!</p>
      ) : (
        people.map((person) => (
          <PersonCard person={person} onAction={() => {}} isInHome={false} />
        ))
      )}
    </div>
  );
};

export default ReceivedRequests;
