import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * PersonCard component
 * @param person - The User object of the person on the card
 * @param onAction - The function to call when the action button 1 is clicked
 * @param isInHome - Is the card is rendered in the homepage
 * @returns {Element}
 * @constructor
 */
const PersonCard = ({ labelValue, onAction, isInHome }) => {
  const { user } = useContext(AuthContext);

  return (
    <div className="person-card">
      <div className="person-info">
        <h4>
          This person would like to chat about {user.currentLabel} {labelValue}
        </h4>
      </div>
      <button onClick={() => onAction()} className="action-button">
        {isInHome ? 'Request Meetup' : 'Chat Now!'}
      </button>
    </div>
  );
};

export default PersonCard;
