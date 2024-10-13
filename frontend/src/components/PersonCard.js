import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Chat from './Chat';
import '../styles/personCard.css';

const PersonCard = ({ labelValue, personId, onAction, isInHome }) => {
  const { user } = useContext(AuthContext);
  const [isClicked, setIsClicked] = useState(false);

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
        <Chat />
      )}
    </div>
  );
};

export default PersonCard;
