import React from 'react';
import { Link } from 'react-router-dom';

const TeamCard = (props) => {
  const { teamName, teamNumber, point } = props;
  return (
    <Link className="team-score-card-wrapper" to={`team/${teamNumber}`}>
      <div className="team-score-card" id={`team-${teamNumber}-score-card`} style={{color: "black"}}>
        <h5> {teamName} </h5>
        <p>{point} Points</p>
      </div>
    </Link>
  );
};

export default TeamCard;