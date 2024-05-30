import React from 'react';
import PropTypes from 'prop-types';
import { components } from 'react-select';

const MenuSelectStyle = {
  option: (provided, state) => {
    const { isDisabled, isFocused } = state;
    return ({
      ...provided,
      fontSize: '13px',
      color: '#212529',
      cursor: isDisabled ? 'default' : 'pointer',
      backgroundColor: isFocused ? '#f5f5f5' : '#fff',
      '.header-icon .dtable-font': {
        color: '#aaa',
      },
    });
  },
  control: (provided) => ({
    ...provided,
    fontSize: '14px',
    cursor: 'pointer',
    lineHeight: '1.5',
  }),
  menuPortal: base => ({ ...base, zIndex: 9999 }),
  indicatorSeparator: () => {},
};

const DropdownIndicator = props => {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <span className="dtable-font dtable-icon-drop-down" style={{ fontSize: '12px' }}></span>
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
  return <components.ClearIndicator {...props} />;
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

export { MenuSelectStyle, DropdownIndicator, ClearIndicator, MenuList, Option };
