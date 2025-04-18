import classnames from 'classnames';
import * as React from 'react';

import './style/badge.css';

export default class Badge extends React.Component {
  static defaultProps = {
    prefixCls: 'am-badge',
    size: 'small',
    overflowCount: 99,
    dot: false,
    corner: false
  };

  render() {
    // tslint:disable:prefer-const
    let {
      className,
      prefixCls,
      children,
      text,
      size,
      overflowCount,
      dot,
      corner,
      hot,
      ...restProps
    } = this.props;
    // eslint-disable-next-line no-self-assign
    overflowCount = overflowCount;
    text =
      typeof text === 'number' && text > overflowCount
        ? `${overflowCount}+`
        : text;

    // dot mode don't need text
    if (dot) {
      text = '';
    }

    const scrollNumberCls = classnames({
      [`${prefixCls}-dot`]: dot,
      [`${prefixCls}-dot-large`]: dot && size === 'large',
      [`${prefixCls}-text`]: !dot && !corner,
      [`${prefixCls}-corner`]: corner,
      [`${prefixCls}-corner-large`]: corner && size === 'large'
    });

    const badgeCls = classnames(prefixCls, className, {
      [`${prefixCls}-not-a-wrapper`]: !children,
      [`${prefixCls}-corner-wrapper`]: corner,
      [`${prefixCls}-hot`]: !!hot,
      [`${prefixCls}-corner-wrapper-large`]: corner && size === 'large'
    });

    return (
      <span className={badgeCls}>
        {children}
        {(text || dot) && (
          // tslint:disable-next-line:jsx-no-multiline-js
          <sup className={scrollNumberCls} {...restProps}>
            {text}
          </sup>
        )}
      </span>
    );
  }
}
