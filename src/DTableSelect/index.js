import React from 'react';
import PropTypes from 'prop-types';
import Select, { components } from 'react-select';

const MenuSelectStyle = {
  option: (provided, state) => {
    const { isDisabled, isSelected, isFocused } = state;
    return ({
      ...provided,
      cursor: isDisabled ? 'default' : 'pointer',
      backgroundColor: isSelected ? '#20a0ff' : (isFocused ? '#f5f5f5' : '#fff'),
      '.header-icon .dtable-font': {
        color: isSelected ? '#fff' : '#aaa',
      },
    });
  },
  control: (provided) => ({
    ...provided,
    fontSize: '14px',
    cursor: 'pointer',
    lineHeight: '1.5',
  }),
  menuPortal:  base => ({ ...base, zIndex: 9999 }),
  indicatorSeparator: () => {},
};

const DropdownIndicator = props => {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <span className="dtable-font dtable-icon-drop-down" style={{fontSize: '12px'}}></span>
      </components.DropdownIndicator>
    )
  );
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

class DtableSelect extends React.Component {

  static propTypes = {
    isMulti: PropTypes.bool,
    options: PropTypes.array.isRequired,
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    isSearchable: PropTypes.bool,
    isClearable: PropTypes.bool,
    placeholder: PropTypes.string,
    classNamePrefix: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    menuPortalTarget: PropTypes.string,
    menuPosition: PropTypes.string,
    noOptionsMessage: PropTypes.func,
  };

  static defaultProps = {
    options: [],
    value: {},
    isSearchable: false,
    isClearable: false,
    placeholder: '',
    isMulti: false,
    menuPortalTarget: '.modal',
    noOptionsMessage: () => {
      return null;
    },
  };

  getMenuPortalTarget = () => {
    let { menuPortalTarget } = this.props;
    return document.querySelector(menuPortalTarget);
  }

  render() {
    const { options, onChange, value, isSearchable, placeholder, isMulti, menuPosition, isClearable, noOptionsMessage, 
      classNamePrefix } = this.props;
    return(
      <Select
        value={value}
        onChange={onChange}
        options={options}
        isMulti={isMulti}
        classNamePrefix={classNamePrefix}
        styles={MenuSelectStyle}
        components={{ Option, DropdownIndicator, MenuList }}
        placeholder={placeholder}
        isSearchable={isSearchable}
        isClearable={isClearable}
        menuPosition={menuPosition || 'fixed'} // when use default menuPosition(absolute), menuPortalTarget is unnecessary. 
        menuShouldScrollIntoView
        menuPortalTarget={this.getMenuPortalTarget()}
        captureMenuScroll={false}
        noOptionsMessage={noOptionsMessage}
      />
    ); 
  }
}

export default DtableSelect;
