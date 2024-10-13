import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import PersonCard from '../components/PersonCard';
import { AuthContext } from '../contexts/AuthContext';
import Chat from '../components/Chat';

const ReceivedRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchReceivedRequests = async () => {
      try {
        console.log('Fetching received requests for user:', user._id);
        const response = await axios.get(
          `http://localhost:8080/api/user/getReceivedRequests/${user._id}`
        );
        console.log('Received requests:', response.data);
        setRequests(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching received requests:', error);
        setLoading(false);
      }
    };

    if (user) {
      fetchReceivedRequests();
    }
  }, [user]);

  const handleAction = async (request) => {
    try {
      await axios.post('http://localhost:8080/api/user/acceptMeetupRequest', {
        requestId: request._id,
        userId: user._id,
      });
      // Remove the accepted request from the list
      setRequests(requests.filter((req) => req._id !== request._id));
    } catch (error) {
      console.error('Error accepting meetup request:', error);
    }
  };

  if (loading) {
    return <div>Loading requests...</div>;
  }

  return (
    <div className="received-requests">
      <h3>Received Meetup Requests</h3>
      {requests.length === 0 ? (
        <p>No meetup requests received yet.</p>
      ) : (
        requests.map((request) => (
          <PersonCard
            key={request._id}
            labelValue={request.senderLabel}
            personId={request.senderId._id}
            onAction={() => handleAction(request)}
            isInHome={false}
          />
        ))
      )}
    </div>
  );
};

export default ReceivedRequests;
