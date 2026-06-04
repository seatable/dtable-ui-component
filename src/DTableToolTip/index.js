import React from 'react';
import PropTypes from 'prop-types';
import { UncontrolledTooltip } from 'reactstrap';

import './index.css';

const DTableToolTip = ({ target, placement = 'bottom', className, children, shortcut }) => {

  const hasShortcut = Boolean(shortcut);

  const renderContent = () => {
    if (hasShortcut) {
      return (
        <div className="dtable-tooltip-shortcut-inner">
          <span className="dtable-tooltip-text">{children}</span>
          <span className="dtable-tooltip-shortcut-keys">
            {shortcut.map((key, index) => (
              <span key={index} className="dtable-tooltip-shortcut-key">
                {key}
              </span>
            ))}
          </span>
        </div>
      );
    }

    return children;
  };

  const tooltipProps = {
    target,
    placement,
    className: `dtable-tooltip ${className ? className : ''}`,
    innerClassName: hasShortcut ? 'dtable-tooltip-shortcut-inner' : '',
    delay: { show: 0, hide: 0 },
    hideArrow: true,
    autohide: false,
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, -2.5],
        },
      },
      {
        name: 'preventOverflow',
        options: {
          boundariesElement: 'window',
        },
      }
    ],
  };

  return (
    <UncontrolledTooltip {...tooltipProps}>
      {renderContent()}
    </UncontrolledTooltip>
  );
};

DTableToolTip.propTypes = {
  target: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.instanceOf(Element)]),
  placement: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  className: PropTypes.string,
  children: PropTypes.node,
  shortcut: PropTypes.arrayOf(PropTypes.string),
};

export default DTableToolTip;
