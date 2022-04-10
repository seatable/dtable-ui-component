import React from 'react';
import PropTypes from 'prop-types';

function DtableSwitch(props) {
  const { onChange, checked, placeholder, disabled, switchClassName } = props;
  return(
    <div className={`dtable-switch ${switchClassName || ''}`}>
      <label className="custom-switch">
        <input 
          className="custom-switch-input" 
          type="checkbox" 
          checked={checked} 
          onChange={onChange} 
          name="custom-switch-checkbox" 
          disabled={disabled}
        />
        <span className="custom-switch-description text-truncate">{placeholder}</span>
        <span className="custom-switch-indicator"></span>
      </label>
    </div>
  );
}

DtableSwitch.propTypes = {
  checked: PropTypes.bool,
  placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  switchClassName: PropTypes.string
};

export default DtableSwitch;
