import React from 'react';
import { ModalHeader } from 'reactstrap';
import DTableIcon from '../DTableIcon';
import IconButton from '../IconButton';

import './index.css';

const DTableModalHeader = ({ children, ...props }) => {
  const customCloseBtn = (
    <IconButton aria-label="Close" onClick={props.toggle} className="modal-close-btn">
      <DTableIcon symbol="modal-close" className="seatable-icon" ariaHidden focusable={false} />
    </IconButton>
  );
  return (
    <ModalHeader {...props} close={customCloseBtn}>
      {children}
    </ModalHeader>
  );
};

export default DTableModalHeader;
