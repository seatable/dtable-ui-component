import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { UncontrolledTooltip } from 'reactstrap';

import './index.css';

const Participant = ({ participant }) => {
  const ref = useRef(null);
  return (
    <span className="dtable-ui-participant-avatar">
      <img src={participant.avatar_url} className="avatar" ref={ref} alt="avatar" />
      {ref.current && (
        <UncontrolledTooltip delay={{ show: 0, hide: 0 }} target={ref} placement='bottom'>
          {participant.name}
        </UncontrolledTooltip>
      )}
    </span>
  );
};

Participant.propTypes = {
  participant: PropTypes.object.isRequired,
};

export default Participant;
