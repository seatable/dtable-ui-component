import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { ROW_EXPAND_BTN_FOCUS_STYLE } from '../../constants';

import './index.css';

const RowExpandAddBtn = forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      tabIndex={0}
      onClick={props.onClick}
      onFocus={props.onFocus}
      role="button"
      className="dtable-ui-row-expand-add-btn d-print-none"
      style={props.isFocus ? ROW_EXPAND_BTN_FOCUS_STYLE : {}}
    >
      <span className="d-print-none">{props.text}</span>
    </div>
  );
});

RowExpandAddBtn.propTypes = {
  isFocus: PropTypes.bool,
  text: PropTypes.string,
  onFocus: PropTypes.func,
  onClick: PropTypes.func,
  t: PropTypes.func,
};

export default RowExpandAddBtn;
