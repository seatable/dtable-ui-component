import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { generatorBase64Code } from 'dtable-utils';

import './index.css';

function DTableSwitch(props) {
  const { onChange, checked, placeholder, disabled, size, switchPosition, switchClassName } = props;
  const switchNode = <span className="custom-switch-indicator"></span>;
  const textNode = <span className="custom-switch-description text-truncate">{placeholder}</span>;
  return (
    <div 
      className={classnames('dtable-switch position-relative',
        { 'disabled': disabled },
        { [size]: size }, 
        { [switchClassName]: switchClassName })
      }
    >
      <label className="custom-switch">
        <input
          className="custom-switch-input"
          type="checkbox"
          checked={checked}
          onChange={onChange}
          name="custom-switch-checkbox"
          disabled={disabled}
          aria-label={placeholder}
          id={'dtable-switch-' + generatorBase64Code(12)}
        />
        {switchPosition === 'left' && <>{switchNode}{textNode}</>}
        {switchPosition === 'right' && <>{textNode}{switchNode}</>}
      </label>
    </div>
  );
}

DTableSwitch.defaultProps = {
  checked: false,
  size: 'sm',
  switchPosition: 'right',
};

DTableSwitch.propTypes = {
  checked: PropTypes.bool,
  size: PropTypes.string, // 'sm || lg'
  switchPosition: PropTypes.string, // 'left || right'
  placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  switchClassName: PropTypes.string
};

export default DTableSwitch;
