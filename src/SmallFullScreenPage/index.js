import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import BodyPortal from '../BodyPortal';
import classnames from 'classnames';
import Header from './header';
import Body from './body';

import './index.css';

const SmallFullScreenPage = ({
  classNamePrefix,
  className,
  style,
  zIndex,
  children,
  onLeftClick,
  onRightClick,
}) => {
  const [isMount, setMount] = useState(false);
  const element = useMemo(() => {
    let _element = document.createElement('div');
    _element.setAttribute('tabindex', '-1');
    _element.style.position = 'relative';
    _element.style.zIndex = zIndex;
    return _element;
  }, [zIndex]);

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
      <div className={classnames('seatable-small-full-screen-page', className, { [`${classNamePrefix}-small-full-screen-page`]: classNamePrefix } )} style={style}>
        <Header classNamePrefix={classNamePrefix} onLeftClick={onLeftClick} onRightClick={onRightClick}>
          {children[0]}
          {children[1]}
          {children[2]}
        </Header>
        <Body classNamePrefix={classNamePrefix}>
          {isMount && (<>{children[3]}</>)}
        </Body>
      </div>
    </BodyPortal>
  );
};

SmallFullScreenPage.propTypes = {
  classNamePrefix: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.any,
  onLeftClick: PropTypes.func,
  onRightClick: PropTypes.func
};

export default SmallFullScreenPage;
