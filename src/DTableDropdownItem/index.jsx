import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { DropdownItem } from 'reactstrap';
import DTableToolTip from '../DTableToolTip';
import SvgIcon from '../DTableIcon/svg-icon';

const DTableDropdownItem = ({ className, divider, id, toggle, disabled, tooltip, itemProps, showChecked, checked, leftSlotContent, rightSlotContent, icon, content, onClick, style, tabIndex }) => {
  if (divider) {
    return <DropdownItem {...itemProps} divider className={className} />;
  }

  const renderedIcon = () => {
    if (!icon || !React.isValidElement(icon)) return null;
    return React.cloneElement(icon, {
      className: classnames(icon.props.className, 'item-icon'),
      'aria-hidden': 'true',
    });
  };

  let customItemProps = { ...itemProps };

  if (typeof onClick === 'function') {
    customItemProps.onClick = onClick;
  }

  if (typeof toggle === 'boolean') {
    customItemProps.toggle = toggle;
  }

  if (style) {
    customItemProps.style = style;
  }

  if (typeof tabIndex === 'number') {
    customItemProps.tabIndex = tabIndex;
  }

  return (
    <DropdownItem
      className={className}
      disabled={disabled}
      id={id}
      {...customItemProps}
    >
      {(leftSlotContent || showChecked) && (
        <span className="dtable-dropdown-item-left-slot">
          {checked && <SvgIcon symbol="check-mark" className="item-icon" />}
          {leftSlotContent || null}
        </span>
      )}
      {renderedIcon()}
      {typeof content === 'string' && (
        <span className="item-text" aria-label={content}>
          {content}
        </span>
      )}
      {typeof content !== 'string' && (content || '')}
      {rightSlotContent && (
        <span className="dtable-dropdown-item-right-slot ml-2">
          {rightSlotContent}
        </span>
      )}
      {(tooltip && id) && (
        <DTableToolTip target={id} placement="right" >
          {tooltip}
        </DTableToolTip>
      )}
    </DropdownItem>
  );
};

DTableDropdownItem.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  divider: PropTypes.bool,
  disabled: PropTypes.bool,
  toggle: PropTypes.bool,
  itemProps: PropTypes.object,
  showChecked: PropTypes.bool,
  checked: PropTypes.bool,
  icon: PropTypes.node,
  leftSlotContent: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.node]),
  rightSlotContent: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.node]),
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.node]),
  tooltip: PropTypes.string,
  style: PropTypes.object,
  tabIndex: PropTypes.number,
  onClick: PropTypes.func,
};

export default DTableDropdownItem;
