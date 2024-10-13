import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Chat from './Chat';
import '../styles/personCard.css';

const PersonCard = ({ labelValue, personId, onAction, isInHome }) => {
  const { user } = useContext(AuthContext);
  const [isClicked, setIsClicked] = useState(false);

  const generateRoomId = (userId1, userId2) => {
    const sortedIds = [userId1, userId2].sort();
    return `${sortedIds[0]}_${sortedIds[1]}`;
  };
  const roomId = generateRoomId(user._id, personId);

  const handleAction = () => {
    setIsClicked(true);
    onAction({
      personId: personId,
      actionType: isInHome ? 'Request Meetup' : 'Accept Request',
    });
  };

  return (
    <div className="person-card">
      <div className="person-info">
        <div>{labelValue}</div>
      </div>
      {isInHome ? (
        <button
          onClick={handleAction}
          className="action-button"
          disabled={isClicked}
        >
          Request Meetup
        </button>
      ) : (
        <Chat roomId={roomId} />
      )}
    </div>
  );
};

export default PersonCard;
