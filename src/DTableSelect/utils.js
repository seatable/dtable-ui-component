import React from 'react';
import PropTypes from 'prop-types';
import { components } from 'react-select';

// DtableSelect is based on seatable-ui.css, so use the following content to override the default react-select style
const DEFAULT_CONTROL_STYLE = {
  fontSize: '14px',
  padding: '0 4px',
  border: '1px solid var(--bs-border-color) !important',
  boxShadow: 'none',
  backgroundColor: 'var(--bs-popover-bg)',
  borderRadius: '4px',
  outline: '0',
};

const DISABLED_CONTROL_STYLE = {
  fontSize: '14px',
  padding: '0 4px',
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
  padding: '0 4px',
  border: '1px solid #3E84F7',
  boxShadow: 'none',
  backgroundColor: 'var(--bs-popover-bg)',
  borderRadius: '4px',
  outline: '0',
};

const controlCallback = (provided, state) => {
  const { isDisabled, isFocused } = state;
  if (isDisabled) {
    return {
      ...provided,
      ...DISABLED_CONTROL_STYLE,
      ':active': {
        border: '1px solid #3E84F7',
      },
      '.header-icon': {
        color: 'var(--bs-icon-secondary-color)',
        padding: '0 0.5rem !important'
      }
    };
  }
  if (isFocused) {
    return {
      ...provided,
      ...FOCUS_CONTROL_STYLE,
    };
  }
  return {
    ...provided,
    fontSize: '14px',
    lineHeight: '1.5',
    cursor: 'pointer',
    ...DEFAULT_CONTROL_STYLE,
  };
};

const MenuSelectStyle = {
  menu: (base) => {
    return ({
      ...base,
      padding: '8px',
      backgroundColor: 'var(--bs-popover-bg)',
      border: '1px solid var(--bs-border-secondary-color)',
      borderRadius: '4px',
      boxShadow: '0px 6px 14px rgba(0, 0, 0, 0.1)',
      marginTop: '4px',
      marginBottom: 0
    });
  },
  menuList: (provided) => ({
    ...provided,
    padding: 0,
  }),
  option: (provided, state) => {
    const { isDisabled, isFocused } = state;
    return ({
      ...provided,
      color: 'var(--bs-body-color)',
      borderRadius: '4px',
      minHeight: '32px',
      padding: '8px',
      cursor: isDisabled ? 'default' : 'pointer',
      backgroundColor: isFocused ? 'var(--bs-hover-bg)' : 'var(--bs-popover-bg)',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      ':hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
      },
      '.header-icon': {
        color: 'var(--bs-icon-secondary-color)',
        padding: '0 0.5rem !important'
      } });
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
    };
  },
  multiValue: (provided) => {
    return {
      ...provided,
      color: 'var(--bs-body-color)',
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
      color: '#868E96',
      opacity: isDisabled ? 0.65 : 1,
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
        <span>{label}</span>
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
