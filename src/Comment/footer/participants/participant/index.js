import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import DTableToolTip from '../../../../DTableToolTip';

import './index.css';

const Participant = ({ participant }) => {
  const ref = useRef(null);
  return (
    <span className="dtable-ui-participant-avatar">
      <img src={participant.avatar_url} className="avatar" ref={ref} alt="avatar" />
      {ref.current && (
        <DTableToolTip target={ref} placement='bottom'>
          {participant.name}
        </DTableToolTip>
      )}
    </span>
  );
};

Participant.propTypes = {
  participant: PropTypes.object.isRequired,
};

export default Participant;
