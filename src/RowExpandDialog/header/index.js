import React from 'react';
import PropTypes from 'prop-types';
import { ModalHeader } from 'reactstrap';
import { getLocale } from '../../lang';

import './index.css';

const Header = ({ onToggle, title }) => {
  return (
    <ModalHeader
      className="d-print-none dtable-ui-row-expand-header"
      close={(
        <div className="dtable-ui-row-expand-header-close-list">
          <span role="button" aria-label={getLocale('Close_expanded_record')} className="dtable-font dtable-icon-x header-close-list-btn" onClick={onToggle}></span>
        </div>
      )}
    >
      <div className="dtable-ui-row-expand-header-left-btns">
        <div className="dtable-ui-row-expand-header-title text-truncate">{title}</div>
      </div>
    </ModalHeader>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default Header;
