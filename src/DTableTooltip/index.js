import React from 'react';
import PropTypes from 'prop-types';
import { UncontrolledTooltip } from 'reactstrap';
import classnames from 'classnames';

import './index.css';

const Tooltip = ({ target, children, className, modifiers, placement = 'bottom', fade = false, delay = 0 }) => {

  const props = {
    popperClassName: classnames('dtable-tooltip', className),
    modifiers: { ...modifiers, preventOverflow: { boundariesElement: window.document.body, ...modifiers?.preventOverflow } },
    placement,
    target,
    fade,
    delay,
  };

  return (
    <UncontrolledTooltip { ...props }>
      {children}
    </UncontrolledTooltip>
  );
};

Tooltip.propTypes = {
  fade: PropTypes.bool,
  target: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  className: PropTypes.string,
  placement: PropTypes.string,
  children: PropTypes.any,
  modifiers: PropTypes.object,
  delay: PropTypes.number,
};

export default Tooltip;
