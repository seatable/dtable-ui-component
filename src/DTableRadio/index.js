import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './index.css';

function SeaTableRadio(props) {
  return (
    <label className="dtable-radio">
      <input
        type="radio"
        className="dtable-radio-input"
        checked={props.isChecked}
        onChange={props.disabled ? () => {} : props.onCheckedChange}
        name={props.name}
        value={props.value}
      />
      <span
        className={classnames('dtable-radio-indicator', {
          'dtable-radio-selected-indicator': props.isChecked,
          'dtable-radio-disable': props.disabled
        })}
      ></span>
      <span className="dtable-radio-description text-truncate">{props.label}</span>
    </label>
  );
}

SeaTableRadio.propTypes = {
  isChecked: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  disabled: PropTypes.bool,
  name: PropTypes.string,
  value: PropTypes.any,
  onCheckedChange: PropTypes.func,
};

SeaTableRadio.defaultProps = {
  disabled: false,
  name: 'dtable-radio-input',
  onCheckedChange: () => {}
};

export default SeaTableRadio;
