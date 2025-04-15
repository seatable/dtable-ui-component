import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { ModalHeader } from 'reactstrap';
import { getLocale } from '../../../lang';
import { isFunction } from '../../../utils/utils';
import IconButton from '../../../IconButton';

import './index.css';

const Header = ({ title, columns, row, onToggle, copyURL, children }) => {

  const renderTitle = useCallback(() => {
    const props = { columns, row };
    const CustomTitle = title;
    if (React.isValidElement(CustomTitle)) return React.cloneElement(CustomTitle, props);
    if (isFunction(CustomTitle)) return (<CustomTitle { ...props } />);
    return (<div className="dtable-ui-row-expand-header-title text-truncate">{title}</div>);
  }, [columns, row, title]);

  return (
    <ModalHeader
      className="d-print-none dtable-ui-row-expand-header"
      close={(
        <div className="dtable-ui-row-expand-header-right-btns">
          {copyURL && (<IconButton icon="url" onClick={() => copyURL()} aria-label={getLocale('Get_URL')} title={getLocale('Get_URL')} />)}
          {children}
          <IconButton icon="x" onClick={onToggle} title={getLocale('Close_expanded_record')} aria-label={getLocale('Close_expanded_record')} />
        </div>
      )}
    >
      <div className="dtable-ui-row-expand-header-left-btns">
        {renderTitle()}
      </div>
    </ModalHeader>
  );
};

Header.propTypes = {
  title: PropTypes.any,
  columns: PropTypes.array,
  row: PropTypes.object,
  copyURL: PropTypes.func,
  children: PropTypes.node,
  onToggle: PropTypes.func.isRequired,
};

export default Header;
