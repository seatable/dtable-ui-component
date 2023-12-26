import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import './index.css';

const propTypes = {
  currentOption: PropTypes.object.isRequired,
  menuOptions: PropTypes.array.isRequired,
  onChangeOption: PropTypes.func.isRequired,
};

const DTableDropdownEditor = ({ currentOption, menuOptions, onChangeOption }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClickMenuOption = (menuOption) => {
    const { value } = menuOption;
    if (value === currentOption.value) return;
    onChangeOption(value);
  };

  return (
    <Dropdown
      isOpen={isOpen}
      className="dropdown-editor"
      toggle={() => setIsOpen(!isOpen)}
    >
      <DropdownToggle className="dropdown-toggle-button d-flex align-items-center" tag="div">
        {currentOption.label}
        <span className="dtable-font dtable-icon-drop-down ml-2" />
      </DropdownToggle>
      <DropdownMenu
        positionFixed={true}
        modifiers={{preventOverflow: { boundariesElement: document.body }}}
      >
        {menuOptions.map(option => {
          return (
            <Fragment key={`item-${option.value}`}>
              {option.value === 'addCustomSharePermission' && (
                <div className="dropdown-divider" />
              )}
              <DropdownItem onClick={() => handleClickMenuOption(option)}>
                {option.label}
                {option.value === currentOption.value && (
                  <i className="dtable-font dtable-icon-check-mark" />
                )}
              </DropdownItem>
            </Fragment>
          );
        })}
      </DropdownMenu>
    </Dropdown>
  );
};

DTableDropdownEditor.propTypes = propTypes;

export default DTableDropdownEditor;
