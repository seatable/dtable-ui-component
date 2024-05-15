import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './index.css';

function DTableRadio(props) {
  const { className } = props;

  return (
    <label
      className={classnames('dtable-radio w-100 align-items-center', {
        'dtable-radio-disable': props.disabled,
        [className]: className
      })}
    >
      <input
        type="radio"
        className="dtable-radio-input position-absolute"
        checked={props.isChecked}
        onChange={props.disabled ? () => {} : props.onCheckedChange}
        name={props.name}
        value={props.value}
      />
      <span
        className={classnames('dtable-radio-indicator position-relative', {
          'dtable-radio-selected-indicator': props.isChecked,
          'dtable-radio-indicator-disable': props.disabled
        })}
      >
      </span>
      <span className="dtable-radio-description text-truncate ml-2">{props.label}</span>
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

DTableRadio.defaultProps = {
  disabled: false,
  name: 'dtable-radio-input',
  onCheckedChange: () => {}
};

export default DTableRadio;
