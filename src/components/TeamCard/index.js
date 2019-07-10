import React from 'react';
import { Link } from 'react-router-dom';

const TeamCard = (props) => {
  const { teamName, teamNumber, point } = props;
  return (
    <Link className="team-score-card" to={`team/${teamNumber}`}>
      <div id={`team-${teamNumber}-score-card`} style={{color: "black"}}>
        <h5> {teamName} </h5>
        {point} Points
      </div>
    </Link>
  );
};

export default TeamCard;