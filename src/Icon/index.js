import classnames from 'classnames';
import * as React from 'react';
import loadSprite from './load-sprite';

export default class Icon extends React.Component {
  static defaultProps = {
    size: 'md'
  };
  componentDidMount() {
    loadSprite();
  }
  render() {
    const { type, className, size, ...restProps } = this.props;
    const cls = classnames(
      className,
      'am-icon',
      `am-icon-${type}`,
      `am-icon-${size}`
    );
    return (
      <svg className={cls} {...restProps}>
        <use xlinkHref={`#${type}`} />
      </svg>
    );
  }
}
