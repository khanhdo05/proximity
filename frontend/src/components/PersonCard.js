import React from 'react';

/**
 * PersonCard component
 * @param person - The User object of the person on the card
 * @param onAction1 - The function to call when the action button 1 is clicked
 * @param isInHome - Is the card is rendered in the homepage
 * @returns {Element}
 * @constructor
 */
const PersonCard = ({ person, onAction, isInHome }) => {
  const personCurrentLabelStatement = person.labels[person.label];
  const mappedLabels = {
    professional: 'Looking for professional connections',
    chatting: 'Looking for someone to chat with',
    dating: 'Looking for a date',
  };

  return (
    <div className="person-card">
      <div className="person-info">
        <h4>Say hi! to {person.name}</h4>
        <p className="details">{mappedLabels[person.label]}</p>
        <p>{personCurrentLabelStatement}</p>
      </div>
      <button onClick={() => onAction(person)} className="action-button">
        {isInHome ? 'Request Meetup' : 'Chat Now!'}
      </button>
    </div>
  );
};

export default PersonCard;
