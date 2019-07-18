import React from 'react';

const TeamCard = (props) => {
  const { teamName, teamNumber, point } = props;
  return (
    <div className="team-score-card-wrapper">
      <div className="team-score-card" id={`team-${teamNumber}-score-card`} style={{color: "black"}}>
        <h5> {teamName} </h5>
        <p>{point} Points</p>
      </div>
    </div>
  );
};

export default TeamCard;