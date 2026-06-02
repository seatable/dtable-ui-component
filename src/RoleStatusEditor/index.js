import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownToggle } from 'reactstrap';
import classnames from 'classnames';
import DTableDropdownMenu from '../DTableDropdownMenu';
import DTableDropdownItem from '../DTableDropdownItem';

import './index.css';

const propTypes = {
  isShowDropdownIcon: PropTypes.bool.isRequired,
  currentOption: PropTypes.object.isRequired,
  menuOptions: PropTypes.array.isRequired,
  onChangeOption: PropTypes.func.isRequired,
  closeShowDropdownIcon: PropTypes.func.isRequired,
};

const RoleStatusEditor = ({ isShowDropdownIcon, currentOption, menuOptions, onChangeOption, closeShowDropdownIcon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuMaxHeight, setMenuMaxHeight] = useState(320);
  const toggleRef = useRef(null);

  useEffect(() => {
    if (isOpen && toggleRef.current) {
      const rect = toggleRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom - 8;
      const spaceAbove = rect.top - 8;
      const maxAvailable = Math.max(spaceBelow, spaceAbove);
      setMenuMaxHeight(Math.min(maxAvailable, 320));
    }
  }, [isOpen]);

  const handleClickMenuOption = (menuOption) => {
    const { value } = menuOption;
    closeShowDropdownIcon && closeShowDropdownIcon();
    if (value === currentOption.value) return;
    onChangeOption(value);
  };

  return (
    <Dropdown
      isOpen={isOpen}
      className="role-status-editor"
      toggle={() => setIsOpen(!isOpen)}
    >
      <DropdownToggle innerRef={toggleRef} className="dropdown-toggle-button d-flex align-items-center" tag="div">
        {currentOption.label}
        <div className="dropdown-icon-container ml-1">
          <span className={classnames('dtable-font dtable-icon-down3', { 'hide': !isShowDropdownIcon })} />
        </div>
      </DropdownToggle>
      <DTableDropdownMenu className="position-fixed" style={{ maxHeight: menuMaxHeight, overflowY: 'auto' }}>
        {menuOptions.map(option => {
          const { value, label } = option;
          return (
            <DTableDropdownItem
              key={`item-${value}`}
              onClick={() => handleClickMenuOption(option)}
              showChecked
              checked={currentOption.value === value}
              content={label}
            />
          );
        })}
      </DTableDropdownMenu>
    </Dropdown>
  );
};

RoleStatusEditor.propTypes = propTypes;

export default RoleStatusEditor;
