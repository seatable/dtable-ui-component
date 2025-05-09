import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import BodyPortal from '../BodyPortal';
import Header from './header';
import Body from './body';
import { isFunction } from '../utils/utils';

import './index.css';

const MobileFullScreenPage = ({
  classNamePrefix,
  className,
  style,
  zIndex,
  children,
  onClose,
  historyCallback,
}) => {
  const [isMount, setMount] = useState(false);

  const element = useMemo(() => {
    let _element = document.createElement('div');
    _element.setAttribute('tabindex', '-1');
    _element.style.position = 'relative';
    _element.style.zIndex = zIndex || 100;
    return _element;
  }, [zIndex]);

  const handelHistoryCallback = useCallback((event) => {
    event.preventDefault();
    if (isFunction(historyCallback)) {
      historyCallback();
      return;
    }

    if (isFunction(onClose)) {
      onClose();
      return;
    }
  }, [onClose, historyCallback]);

  useEffect(() => {
    // eslint-disable-next-line no-restricted-globals
    history.pushState(null, null, '#');
    window.addEventListener('popstate', handelHistoryCallback, false);
    return () => {
      window.removeEventListener('popstate', handelHistoryCallback, false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handelHistoryCallback]);

  useEffect(() => {
    document.body.appendChild(element);
    setMount(true);
    return () => {
      document.body.removeChild(element);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BodyPortal node={element}>
      <div className={classnames('dtable-ui-mobile-full-screen-page', className, { [`${classNamePrefix}-mobile-full-screen-page`]: classNamePrefix } )} style={style}>
        {isMount && children}
      </div>
    </BodyPortal>
  );
};

MobileFullScreenPage.propTypes = {
  classNamePrefix: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.any,
  historyCallback: PropTypes.func,
};

MobileFullScreenPage.Header = Header;
MobileFullScreenPage.Body = Body;

export default MobileFullScreenPage;
