import React from 'react';
import PropTypes from 'prop-types';
import { components } from 'react-select';

import './dtable-select-label.css';

// DtableSelect is based on seatable-ui.css, so use the following content to override the default react-select style
const DEFAULT_CONTROL_STYLE = {
  fontSize: '14px',
  padding: '0 4px 0 8px',
  border: '1px solid var(--bs-border-color) !important',
  boxShadow: 'none',
  backgroundColor: 'var(--bs-popover-bg)',
  borderRadius: '4px',
  outline: '0',
};

const DISABLED_CONTROL_STYLE = {
  fontSize: '14px',
  padding: '0 4px 0 8px',
  border: '1px solid rgba(0, 40, 100, 0.12)',
  boxShadow: 'none',
  backgroundColor: 'var(--bs-bg-color)',
  borderRadius: '4px',
  outline: '0',
  cursor: 'default',
  opacity: 0.65,
};

const FOCUS_CONTROL_STYLE = {
  fontSize: '14px',
  padding: '0 4px 0 8px',
  border: '1px solid var(--bs-bg-border-color)',
  boxShadow: 'none',
  backgroundColor: 'var(--bs-popover-bg)',
  borderRadius: '4px',
  outline: '0',
};

const HEADER_ICON_STYLE = {
  margin: '0 0.5rem 0 0 !important',
  padding: 0
};

const controlCallback = (provided, state) => {
  const { isDisabled, isFocused } = state;
  const headerIconStyle = {
    '.header-icon': HEADER_ICON_STYLE,
    '.header-icon .dtable-font': {
      color: 'var(--bs-icon-secondary-color) !important'
    }
  };
  if (isDisabled) {
    return {
      ...provided,
      ...DISABLED_CONTROL_STYLE,
      ':active': {
        border: '1px solid var(--bs-bg-border-color)',
      },
      ...headerIconStyle,
    };
  }
  if (isFocused) {
    return {
      ...provided,
      ...FOCUS_CONTROL_STYLE,
      ...headerIconStyle,
    };
  }
  return {
    ...provided,
    fontSize: '14px',
    lineHeight: '1.5',
    cursor: 'pointer',
    ...DEFAULT_CONTROL_STYLE,
    ...headerIconStyle,
  };
};

const MenuSelectStyle = {
  menu: (base) => {
    return ({
      ...base,
      backgroundColor: 'var(--bs-popover-bg)',
      border: '1px solid var(--bs-border-secondary-color)',
      borderRadius: '4px',
      boxShadow: 'var(--bs-border-secondary-shadow)',
      marginTop: '4px',
      marginBottom: 0
    });
  },
  menuList: (provided) => ({
    ...provided,
    padding: '8px',
  }),
  option: (provided, state) => {
    const { isDisabled } = state;
    return ({
      ...provided,
      color: 'var(--bs-body-color)',
      borderRadius: '4px',
      minHeight: '32px',
      padding: '8px',
      cursor: isDisabled ? 'default' : 'pointer',
      backgroundColor: 'var(--bs-popover-bg)',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      ':hover': {
        backgroundColor: 'var(--bs-btn-background-hover)',
      },
      '.header-icon': HEADER_ICON_STYLE });
  },
  control: controlCallback,
  menuPortal: base => ({
    ...base,
    zIndex: 9999,
    backgroundColor: 'var(--bs-popover-bg)',
    color: 'var(--bs-body-color)',
    borderColor: 'var(--bs-border-secondary-color)',
  }),
  singleValue: (provided) => {
    return {
      ...provided,
      color: 'var(--bs-body-color)',
      margin: 0
    };
  },
  multiValue: (provided) => {
    return {
      ...provided,
      color: 'var(--bs-body-color)',
      margin: 0
    };
  },
  multiValueRemove: (styles) => ({
    ...styles,
    '.dtable-font': {
      color: 'var(--bs-icon-color)',
    },
    '.dtable-font:hover': {
      backgroundColor: 'transparent',
      color: 'var(--bs-icon-color)',
    },
  }),
  input: (styles) => ({
    ...styles,
    color: 'var(--bs-body-color)',
  }),
  placeholder: (provided, state) => {
    const { isDisabled } = state;
    return {
      ...provided,
      color: 'var(--bs-bg-placeholder-color)',
      opacity: isDisabled ? 0.65 : 1,
      margin: 0
    };
  },
  indicatorSeparator: (styles, state) => {
    return {
      'display': 'none'
    };
  },
  dropdownIndicator: (provided, state) => {
    const { isDisabled } = state;
    return {
      ...provided,
      paddingRight: '12px',
      '.dtable-font': {
        color: 'var(--bs-icon-color) !important',
        opacity: isDisabled ? 0.65 : 1,
      }
    };
  },
};
const DropdownIndicator = props => {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <span className="dtable-font dtable-icon-down3" style={{ fontSize: '12px', marginLeft: '-2px', color: 'var(--bs-icon-color)', paddingRight: 0 }}></span>
      </components.DropdownIndicator>
    )
  );
};

const ClearIndicator = ({ innerProps, ...props }) => {
  const onMouseDown = e => {
    e.nativeEvent.stopImmediatePropagation();
    innerProps.onMouseDown(e);
  };
  props.innerProps = { ...innerProps, onMouseDown };
  return (
    <components.ClearIndicator {...props} >
      <span className="dtable-font dtable-icon-fork-number" style={{ fontSize: '12px', marginRight: '-2px', color: 'var(--bs-icon-color)' }}></span>
    </components.ClearIndicator>
  );
};

ClearIndicator.propTypes = {
  innerProps: PropTypes.object,
};

const MenuList = (props) => (
  <div onClick={e => e.nativeEvent.stopImmediatePropagation()} onMouseDown={e => e.nativeEvent.stopImmediatePropagation()} >
    <components.MenuList {...props}>{props.children}</components.MenuList>
  </div>
);

MenuList.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

const Option = props => {
  const { isSelected, label } = props;
  return (
    <components.Option {...props}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', whiteSpace: 'pre-line' }}>
        <div className='seatable-option option-name'>{label}</div>
        {isSelected && <span className="dtable-font dtable-icon-check" style={{ fontSize: '14px', color: 'var(--bs-icon-color)', paddingLeft: '16px' }}></span>}
      </div>
    </components.Option>
  );
};

Option.propTypes = {
  data: PropTypes.shape({
    style: PropTypes.object,
  }),
};

const processOptionsWithClear = (options, isClearable) => {
  if (isClearable && options && options.length > 0) {
    return [
      { label: '--', value: '__clear__' },
      ...options
    ];
  }
  return options;
};

const handleSelectChange = (selectedOption, actionMeta, onChangeCallback) => {
  if (selectedOption && selectedOption.value === '__clear__') {
    onChangeCallback(null, { ...actionMeta, action: 'clear' });
  } else {
    onChangeCallback(selectedOption, actionMeta);
  }
};

const createHandleChange = (onChange) => {
  return (selectedOption, actionMeta) => {
    handleSelectChange(selectedOption, actionMeta, onChange);
  };
};

export { MenuSelectStyle, DropdownIndicator, ClearIndicator, MenuList, Option, processOptionsWithClear, handleSelectChange, createHandleChange };
