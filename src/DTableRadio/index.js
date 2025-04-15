import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './index.css';

function DTableRadio({
  disabled = false,
  name = 'dtable-radio-input',
  onCheckedChange = () => {},
  className,
  isChecked,
  value,
  label
}) {

  return (
    <label
      className={classnames('dtable-radio w-100 align-items-center position-relative', {
        'dtable-radio-disable': disabled,
        [className]: className
      })}
    >
      <input
        type="radio"
        className="dtable-radio-input position-absolute"
        checked={isChecked}
        onChange={disabled ? () => {} : onCheckedChange}
        name={name}
        value={value}
      />
      <span
        className={classnames('dtable-radio-indicator position-relative', {
          'dtable-radio-selected-indicator': isChecked,
          'dtable-radio-indicator-disable': disabled
        })}
      >
      </span>
      <span className="dtable-radio-description text-truncate ml-2">{label}</span>
    </label>
  );
}

DTableRadio.propTypes = {
  isChecked: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  disabled: PropTypes.bool,
  name: PropTypes.string,
  value: PropTypes.any,
  className: PropTypes.string,
  onCheckedChange: PropTypes.func,
};

export default DTableRadio;
