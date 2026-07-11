import React from 'react';
import { ModalHeader } from 'reactstrap';
import IconButton from '../IconButton';

import './index.css';

const DTableModalHeader = ({ children, ...props }) => {
  const customCloseBtn = (
    <IconButton icon="x" aria-label="Close" onClick={props.toggle} className='modal-close-btn'/>
  );
  return (
    <ModalHeader {...props} close={customCloseBtn}>
      {children}
    </ModalHeader>
  );
};

export default DTableModalHeader;
