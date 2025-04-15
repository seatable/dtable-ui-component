import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { ROW_EXPAND_BTN_FOCUS_STYLE } from '../../../constants';

import './index.css';


const Large = forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      tabIndex={0}
      onClick={props.onClick}
      onFocus={props.onFocus}
      role="button"
      className={classnames('dtable-ui-row-expand-add-btn d-print-none', props.className)}
      style={props.isFocus ? ROW_EXPAND_BTN_FOCUS_STYLE : {}}
    >
      <span className="d-print-none">{props.text}</span>
    </div>
  );
});

Large.propTypes = {
  isFocus: PropTypes.bool,
  text: PropTypes.string,
  className: PropTypes.string,
  onFocus: PropTypes.func,
  onClick: PropTypes.func,
};

export default Large;
