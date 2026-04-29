import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { MenuSelectStyle, DropdownIndicator, MenuList, Option, processOptionsWithClear, createHandleChange } from './utils';

export default class DTableSelect extends React.Component {

  static propTypes = {
    isMulti: PropTypes.bool,
    options: PropTypes.array.isRequired,
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]),
    isSearchable: PropTypes.bool,
    isClearable: PropTypes.bool,
    placeholder: PropTypes.string,
    classNamePrefix: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    menuPortalTarget: PropTypes.string,
    menuPosition: PropTypes.string,
    noOptionsMessage: PropTypes.func,
    innerRef: PropTypes.object,
    isDisabled: PropTypes.bool,
    customFilterOption: PropTypes.func,
    form: PropTypes.string,
    autoFocus: PropTypes.bool,
    closeMenuOnSelect: PropTypes.bool,
    onMenuClose: PropTypes.func,
    components: PropTypes.object,
  };

  static defaultProps = {
    options: [],
    value: {},
    isDisabled: false,
    isSearchable: false,
    isClearable: false,
    placeholder: '',
    isMulti: false,
    autoFocus: false,
    closeMenuOnSelect: true,
    menuPortalTarget: '.modal',
    noOptionsMessage: () => {
      return null;
    },
  };

  render() {
    const { options, onChange, value, isSearchable, placeholder, isMulti, menuPosition, isClearable, noOptionsMessage,
      classNamePrefix, style, innerRef, isDisabled, form, customFilterOption, autoFocus, className, closeMenuOnSelect, onMenuClose, components: userComponents } = this.props;
    const mergedComponents = { Option, DropdownIndicator, MenuList, ClearIndicator, ...userComponents };
    const processedOptions = processOptionsWithClear(options, isClearable);
    return (
      <Select
        value={value}
        onChange={createHandleChange(onChange, isMulti)}
        options={processedOptions}
        isMulti={isMulti}
        isClearable={false}
        className={className}
        classNamePrefix={classNamePrefix}
        styles={style || MenuSelectStyle}
        components={mergedComponents}
        placeholder={placeholder}
        isSearchable={isSearchable}
        menuPosition={menuPosition || 'fixed'} // when use default menuPosition(absolute), menuPortalTarget is unnecessary.
        menuShouldScrollIntoView
        menuPortalTarget={document.querySelector(this.props.menuPortalTarget)}
        captureMenuScroll={false}
        closeMenuOnSelect={closeMenuOnSelect}
        onMenuClose={onMenuClose}
        hideSelectedOptions={false}
        noOptionsMessage={noOptionsMessage}
        isDisabled={isDisabled}
        ref={innerRef}
        filterOption={customFilterOption}
        form={form}
        autoFocus={autoFocus}
      />
    );
  }
}
