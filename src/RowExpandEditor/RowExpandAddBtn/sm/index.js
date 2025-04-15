import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './index.css';

const Small = forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      onClick={props.onClick}
      className={classnames('mobile-dtable-ui-row-expand-add-btn', props.className)}
    >
      {props.text}
    </div>
  );
});

Small.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default Small;
