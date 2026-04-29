import React from 'react';
import PropTypes from 'prop-types';
import { components } from 'react-select';

// DtableSelect is based on seatable-ui.css, so use the following content to override the default react-select style
const DEFAULT_CONTROL_STYLE = {
  border: '1px solid rgba(0, 40, 100, 0.12) !important',
};

const FOCUS_CONTROL_STYLE = {
  fontSize: '14px',
  backgroundColor: '#ffffff',
  borderColor: '#1991eb',
  outline: '0',
  boxShadow: '0 0 0 2px rgba(70, 127, 207, 0.25)',
};

const noneCallback = () => ({
  display: 'none',
});

const controlCallback = (provided, state) => {
  const { isDisabled, isFocused } = state;
  if (isFocused && !isDisabled) {
    return {
      ...provided,
      ...FOCUS_CONTROL_STYLE,
      '&:hover': {
        ...provided,
        ...FOCUS_CONTROL_STYLE,
      }
    };
  }
  return {
    ...provided,
    fontSize: '14px',
    lineHeight: '1.5',
    cursor: 'pointer',
    ...DEFAULT_CONTROL_STYLE,
    '&:hover': {
      ...DEFAULT_CONTROL_STYLE,
    }
  };
};

const UserSelectStyle = {
  option: (provided, state) => {
    const { isDisabled, isFocused } = state;
    return ({
      ...provided,
      cursor: isDisabled ? 'default' : 'pointer',
      backgroundColor: isFocused ? '#f5f5f5' : '#fff',
    });
  },
  control: controlCallback,
  indicatorSeparator: noneCallback,
  dropdownIndicator: noneCallback,
  clearIndicator: noneCallback,
  multiValue: (provided) => {
    return {
      ...provided,
      display: 'inline-flex',
      alignItems: 'center',
      background: '#eaeaea',
      borderRadius: '10px',
      margin: '0 10px 0 0',
      padding: '0 0 0 2px',
    };
  },
  multiValueLabel: (provided) => {
    return {
      ...provided,
      padding: '0px',
    };
  },
  multiValueRemove: (provided) => {
    return {
      ...provided,
      color: '#666',
      ':hover': {
        backgroundColor: 'transparent',
        color: '#555555',
      }
    };
  },
  singleValue: (provided) => {
    return {
      ...provided,
      display: 'inline-flex',
      alignItems: 'center',
      background: '#eaeaea',
      borderRadius: '10px',
      margin: '0',
      padding: '0 2px',
      width: 'fit-content',
    };
  },
};

const MenuSelectStyle = {
  option: (provided, state) => {
    const { isDisabled, isFocused } = state;
    return ({
      ...provided,
      padding: '8px',
      fontSize: '14px',
      color: '#212529',
      cursor: isDisabled ? 'default' : 'pointer',
      backgroundColor: isFocused ? '#f5f5f5' : '#fff',
      borderRadius: '4px',
      ':active': {
        backgroundColor: '#f5f5f5',
      },
      '.header-icon .dtable-font': {
        color: '#999',
      },
      '.header-icon .multicolor-icon': {
        color: '#999',
      },
      '.seatable-ui-select-tip': {
        fontSize: '12px',
        color: '#666666'
      },
    });
  },
  control: controlCallback,
  menuPortal: base => ({ ...base, zIndex: 9999 }),
  indicatorSeparator: noneCallback,
  menuList: (provided) => ({
    ...provided,
    padding: '8px',
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    padding: '2px 8px 2px 16px',
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    padding: 0,
  }),
};

const DropdownIndicator = props => {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <span className="dtable-font dtable-icon-down3" style={{ fontSize: '12px', marginLeft: '-2px', color: '#666666', paddingRight: '16px' }}></span>
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
      <span className="dtable-font dtable-icon-fork-number" style={{ fontSize: '12px', marginRight: '-2px' }}></span>
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <span>{label}</span>
        {isSelected && <span className="dtable-font dtable-icon-check" style={{ fontSize: '14px', color: '#666666', paddingLeft: '16px' }}></span>}
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

const handleSelectChange = (selectedOption, actionMeta, onChangeCallback, isMulti) => {
  if (isMulti && Array.isArray(selectedOption)) {
    const hasClear = selectedOption && selectedOption.some(opt => opt && opt.value === '__clear__');
    if (hasClear) {
      onChangeCallback([], { ...actionMeta, action: 'clear' });
      return;
    }
  } else if (selectedOption && selectedOption.value === '__clear__') {
    onChangeCallback(null, { ...actionMeta, action: 'clear' });
    return;
  }

  onChangeCallback(selectedOption, actionMeta);
};

const createHandleChange = (onChange, isMulti) => {
  return (selectedOption, actionMeta) => {
    handleSelectChange(selectedOption, actionMeta, onChange, isMulti);
  };
};

export { UserSelectStyle, MenuSelectStyle, DropdownIndicator, ClearIndicator, MenuList, Option, processOptionsWithClear, handleSelectChange, createHandleChange };
