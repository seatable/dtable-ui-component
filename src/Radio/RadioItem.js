import classnames from 'classnames';
import * as React from 'react';
import List from '../List';
import Radio from './Radio';

const ListItem = List.Item;
function noop() {}

export default class RadioItem extends React.Component {
  static defaultProps = {
    prefixCls: 'am-radio',
    listPrefixCls: 'am-list',
    radioProps: {}
  };

  render() {
    const {
      listPrefixCls,
      onChange,
      disabled,
      radioProps,
      onClick,
      ...otherProps
    } = this.props;
    const { prefixCls, className, children } = otherProps;
    const wrapCls = classnames(`${prefixCls}-item`, className, {
      [`${prefixCls}-item-disabled`]: disabled === true
    });

    // Note: if not omit `onChange`, it will trigger twice on check listitem

    if (!disabled) {
      otherProps.onClick = onClick || noop;
    }

    const extraProps = {}
    ;['name', 'defaultChecked', 'checked', 'onChange', 'disabled'].forEach(
      i => {
        if (i in this.props) {
          extraProps[i] = this.props[i];
        }
      }
    );

    return (
      <ListItem
        {...otherProps}
        prefixCls={listPrefixCls}
        className={wrapCls}
        extra={<Radio {...radioProps} {...extraProps} />}
      >
        {children}
      </ListItem>
    );
  }
}
