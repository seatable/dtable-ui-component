import React from 'react';
import { ModalHeader } from 'reactstrap';
import './index.css';

const DTableModalHeader = ({ children, ...props }) => {
  const customCloseBtn = (
    <button type="button" className="close dtable-modal-close" data-dismiss="modal" aria-label="Close" onClick={props.toggle}>
      <span className="dtable-modal-close-inner">
        <i className="dtable-font dtable-icon-x" aria-hidden="true"></i>
      </span>
    </button>
  );
  return (
    <ModalHeader {...props} close={customCloseBtn}>
      {children}
    </ModalHeader>
  );
};

export default DTableModalHeader;
