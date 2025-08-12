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
      fontSize: '13px',
      color: '#212529',
      cursor: isDisabled ? 'default' : 'pointer',
      backgroundColor: isFocused ? '#f5f5f5' : '#fff',
      ':active': {
        backgroundColor: '#f5f5f5',
      },
      '.header-icon .dtable-font': {
        color: '#aaa',
      },
      '.header-icon .multicolor-icon': {
        color: '#aaa',
      },
    });
  },
  control: controlCallback,
  menuPortal: base => ({ ...base, zIndex: 9999 }),
  indicatorSeparator: noneCallback,
};

const DropdownIndicator = props => {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <span className="dtable-font dtable-icon-down3" style={{ fontSize: '12px', marginLeft: '-2px' }}></span>
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
  return (
    <div style={props.data.style}>
      <components.Option {...props} />
    </div>
  );
};

Option.propTypes = {
  data: PropTypes.shape({
    style: PropTypes.object,
  }),
};

export { UserSelectStyle, MenuSelectStyle, DropdownIndicator, ClearIndicator, MenuList, Option };
