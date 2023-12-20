import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { MenuSelectStyle, DropdownIndicator, ClearIndicator, MenuList, Option } from './utils';

export default class DTableSelect extends React.Component {

  static propTypes = {
    isMulti: PropTypes.bool,
    options: PropTypes.array.isRequired,
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]),
    isSearchable: PropTypes.bool,
    isClearable: PropTypes.bool,
    placeholder: PropTypes.string,
    classNamePrefix: PropTypes.string,
    style: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    menuPortalTarget: PropTypes.string,
    menuPosition: PropTypes.string,
    noOptionsMessage: PropTypes.func,
    innerRef: PropTypes.object,
    isDisabled: PropTypes.bool,
    customFilterOption: PropTypes.func,
    form: PropTypes.string,
  };

  static defaultProps = {
    options: [],
    value: {},
    isDisabled: false,
    isSearchable: false,
    isClearable: false,
    placeholder: '',
    isMulti: false,
    menuPortalTarget: '.modal',
    noOptionsMessage: () => {
      return null;
    },
  };

  render() {
    const { options, onChange, value, isSearchable, placeholder, isMulti, menuPosition, isClearable, noOptionsMessage,
      classNamePrefix, style, innerRef, isDisabled, form, customFilterOption } = this.props;
    return (
      <Select
        value={value}
        onChange={onChange}
        options={options}
        isMulti={isMulti}
        classNamePrefix={classNamePrefix}
        styles={style || MenuSelectStyle}
        components={{ Option, DropdownIndicator, MenuList, ClearIndicator }}
        placeholder={placeholder}
        isSearchable={isSearchable}
        isClearable={isClearable}
        menuPosition={menuPosition || 'fixed'} // when use default menuPosition(absolute), menuPortalTarget is unnecessary.
        menuShouldScrollIntoView
        menuPortalTarget={document.querySelector(this.props.menuPortalTarget)}
        captureMenuScroll={false}
        hideSelectedOptions={false}
        noOptionsMessage={noOptionsMessage}
        isDisabled={isDisabled}
        ref={innerRef}
        filterOption={customFilterOption}
        form={form}
      />
    );
  }
}
