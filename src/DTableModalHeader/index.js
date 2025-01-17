import React from 'react';
import { ModalHeader } from 'reactstrap';
import IconButton from '../IconButton';

import './index.css';

const DTableModalHeader = ({ children, ...props }) => {
  const customCloseBtn = (
    <button type="button" className="close dtable-modal-close" data-dismiss="modal" aria-label="Close" onClick={props.toggle}>
      <IconButton icon="x" className="dtable-modal-close-inner" />
    </button>
  );
  return (
    <ModalHeader {...props} close={customCloseBtn}>
      {children}
    </ModalHeader>
  );
};

export default DTableModalHeader;
