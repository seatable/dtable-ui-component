import classnames from 'classnames';
import * as React from 'react';
import Item from './list-item';

import './index.css';

class List extends React.Component {
  static defaultProps = {
    prefixCls: 'am-list',
  };
  render() {
    const {
      prefixCls,
      children,
      className,
      style,
      renderHeader,
      renderFooter,
      ...restProps
    } = this.props;

    const wrapCls = classnames(prefixCls, className);

    return (
      <div className={wrapCls} style={style} {...restProps}>
        {renderHeader ? (
          <div className={`${prefixCls}-header`}>
            {typeof renderHeader === 'function' ? renderHeader() : renderHeader}
          </div>
        ) : null}
        {children ? (
          <div className={`${prefixCls}-body`}>{children}</div>
        ) : null}
        {renderFooter ? (
          <div className={`${prefixCls}-footer`}>
            {typeof renderFooter === 'function' ? renderFooter() : renderFooter}
          </div>
        ) : null}
      </div>
    );
  }
}

List.Item = Item;

export default List;
