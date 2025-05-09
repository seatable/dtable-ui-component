import React from 'react';
import PropTypes from 'prop-types';
import { Label } from 'reactstrap';

import './index.css';

const ColumnContent = ({ column, children }) => {
  const { name } = column;
  return (
    <div className="dtable-ui-mobile-row-expand-item">
      <div className="dtable-ui-mobile-row-expand-item-title">
        <Label>{name}</Label>
        {/* {!editable && <i aria-hidden="true" className="dtable-font dtable-icon-unlock dtable-ui-mobile-column-uneditable-tip"></i>} */}
      </div>
      {children}
    </div>
  );
};

ColumnContent.propTypes = {
  column: PropTypes.object,
  children: PropTypes.any,
};

export default ColumnContent;
