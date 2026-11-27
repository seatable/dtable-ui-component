import React from 'react';
import PropTypes from 'prop-types';
import { DropdownToggle } from 'reactstrap';
import classnames from 'classnames';
import { getLocale } from '../lang';
import SvgIcon from '../DTableIcon/svg-icon';

const DTableSubDropdownToggle = ({ className, id, text, icon, disabled, hideArrow = false, title, ariaLabel, ariaExpanded = false, toggleProps }) => {
  const renderedIcon = () => {
    if (!icon || !React.isValidElement(icon)) return null;
    return React.cloneElement(icon, {
      className: classnames(icon.props.className, 'item-icon'),
      'aria-hidden': 'true',
    });
  };

  return (
    <DropdownToggle
      id={id}
      className={classnames('dtable-sub-dropdown-toggle dropdown-item', className)}
      role="button"
      tag="div"
      data-toggle="dropdown"
      title={title || getLocale('More_operations')}
      aria-label={ariaLabel || getLocale('More_operations')}
      aria-expanded={ariaExpanded}
      disabled={disabled}
      {...toggleProps}
    >
      {renderedIcon()}
      <span className="item-text">{text}</span>
      {!hideArrow && (<SvgIcon symbol="arrow-right-b" className="item-icon mr-0" ariaHidden />)}
    </DropdownToggle>
  );
};

DTableSubDropdownToggle.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  text: PropTypes.string,
  icon: PropTypes.object,
  disabled: PropTypes.bool,
  hideArrow: PropTypes.bool,
  ariaExpanded: PropTypes.bool,
  toggleProps: PropTypes.object,
};

export default DTableSubDropdownToggle;
