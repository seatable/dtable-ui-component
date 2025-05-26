import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import List from '../List';
import MobileModal from '../MobileModal';
import Search from './search';
import Options from './options';
import Option from './option';
import Empty from './empty';

import './index.css';

const MobileSelector = ({
  className,
  listClassName,
  title,
  children,
  onClose,
}) => {
  const handleHistoryBack = useCallback((event) => {
    event.preventDefault();
    onClose && onClose();
  }, [onClose]);

  useEffect(() => {
    history.pushState(null, null, '#'); // eslint-disable-line
    window.addEventListener('popstate', handleHistoryBack, false);
    return () => {
      window.removeEventListener('popstate', handleHistoryBack, false);
    };
  }, [handleHistoryBack]);

  const renderHeader = useCallback(() => {
    return (
      <div className="position-relative">
        <span>{title}</span>
        <span className="mobile-selector-editor-close-btn dtable-font dtable-icon-x" onClick={onClose}></span>
      </div>
    );
  }, [title, onClose]);

  return (
    <MobileModal onClose={onClose} className={className}>
      <List renderHeader={renderHeader} className={classnames('popup-list dtable-ui-mobile-selector', listClassName)}>
        {children}
      </List>
    </MobileModal>
  );
};

MobileSelector.propTypes = {
  className: PropTypes.string,
  listClassName: PropTypes.string,
  title: PropTypes.any,
  children: PropTypes.any,
  onClose: PropTypes.func,
};

MobileSelector.Search = Search;
MobileSelector.Option = Option;
MobileSelector.Options = Options;
MobileSelector.Empty = Empty;

export default MobileSelector;
