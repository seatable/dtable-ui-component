import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './index.css';

function DTableRadio(props) {
  const {
    className,
    disabled = false,
    isChecked,
    label,
    name = 'dtable-radio-input',
    onCheckedChange = () => {},
    value,
  } = props;

  const [isWaveAnimating, setWaveAnimation ] = useState(false);

  const handleRadioClick = () => {
    if (disabled) return;
    if (isWaveAnimating) {
      return;
    }

    setWaveAnimation(true);

    setTimeout(() => {
      setWaveAnimation(false);
    }, 400);
  };

  return (
    <label
      className={classnames('dtable-radio align-items-center', {
        'dtable-radio-disable': disabled,
        [className]: className
      })}
    >
      <span
        className={classnames('dtable-radio-indicator position-relative', {
          'dtable-radio-selected-indicator': isChecked,
          'dtable-radio-indicator-disable': disabled,
          'dtable-wave': isWaveAnimating,
        })}
        onClick={handleRadioClick}
      >
        <input
          type="radio"
          className="dtable-radio-input position-absolute"
          checked={isChecked}
          onChange={disabled ? () => {} : onCheckedChange}
          name={name}
          value={value}
        />
        <span className="dtable-radio-inner" />
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
