import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import classnames from 'classnames';

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
      <DropdownToggle className="dropdown-toggle-button d-flex align-items-center" tag="div">
        {currentOption.label}
        <div className="dropdown-icon-container ml-1">
          <span className={classnames('dtable-font dtable-icon-drop-down', {'hide': !isShowDropdownIcon})} />
        </div>
      </DropdownToggle>
      <DropdownMenu
        positionFixed={true}
        modifiers={{preventOverflow: { boundariesElement: document.body }}}
      >
        {menuOptions.map(option => {
          const {value, label } = option;
          return (
            <DropdownItem key={`item-${value}`} onClick={() => handleClickMenuOption(option)}>
              {label}
              {value === currentOption.value && (
                <i className="dtable-font dtable-icon-check-mark ml-2" />
              )}
            </DropdownItem>
          );
        })}
      </DropdownMenu>
    </Dropdown>
  );
};

RoleStatusEditor.propTypes = propTypes;

export default RoleStatusEditor;
