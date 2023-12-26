import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './index.css';

const DTableAddTool = ({ callBack, footerName, className, addIconClassName }) => {
  return (
    <div className={classnames('dtable-ui-add-item-btn', className)} onClick={(e) => callBack(e)}>
      <i className={classnames('dtable-font dtable-icon-add-table', addIconClassName)}></i>
      <span className="dtable-ui-add-new-option text-truncate" title={footerName}>{footerName}</span>
    </div>
  );
};

DTableAddTool.propTypes = {
  className: PropTypes.string,
  addIconClassName: PropTypes.string,
  footerName: PropTypes.string.isRequired,
  callBack: PropTypes.func.isRequired,
};

export default DTableAddTool;
