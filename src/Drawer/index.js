import RmcDrawer from 'rmc-drawer';
import * as React from 'react';
import './index.css';

export default class Drawer extends React.Component {
  static defaultProps = {
    prefixCls: 'am-drawer',
    enableDragHandle: false
  };
  render() {
    return <RmcDrawer {...this.props} />;
  }
}
