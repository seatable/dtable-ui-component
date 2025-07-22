import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './index.css';

const CollapsibleSettingLayout = (props) => {
  const { className, title, children } = props;
  const [isShowSettings, setIsShowSettings] = useState(true);

  return (
    <div className={classnames('collapsible-setting-layout', className)}>
      <div
        className="collapsible-setting-layout-header seatable-collapse-header w-100 d-flex align-items-center"
        onClick={() => setIsShowSettings(!isShowSettings)}
      >
        <span className="collapsible-setting-layout-title">{title}</span>
        <i className={`dtable-font dtable-icon-right${isShowSettings ? ' dtable-icon-spin' : ''}`}></i>
      </div>
      {isShowSettings && <div className="collapsible-setting-layout-body mt-3 pl-2">{children || ''}</div>}
    </div>
  );
};

CollapsibleSettingLayout.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};

export default CollapsibleSettingLayout;
