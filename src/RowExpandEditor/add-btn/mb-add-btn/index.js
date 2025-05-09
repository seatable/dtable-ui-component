import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './index.css';

const RowExpandMBAddBtn = forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      onClick={props.onClick}
      className={classnames('dtable-ui-mobile-row-expand-add-btn', props.className)}
    >
      {props.text}
    </div>
  );
});

RowExpandMBAddBtn.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default RowExpandMBAddBtn;
