import * as React from 'react';
import { DefaultTabBar as RMCDefaultTabBar, Tabs as RMCTabs } from 'rmc-tabs';

export class DefaultTabBar extends RMCDefaultTabBar {
  static defaultProps = {
    ...RMCDefaultTabBar.defaultProps,
    prefixCls: 'am-tabs-default-bar'
  };
}

export default class Tabs extends React.PureComponent {
  static DefaultTabBar = DefaultTabBar;

  static defaultProps = {
    prefixCls: 'am-tabs'
  };

  renderTabBar = props => {
    const { renderTab } = this.props;
    return <DefaultTabBar {...props} renderTab={renderTab} />;
  };

  render() {
    return <RMCTabs renderTabBar={this.renderTabBar} {...this.props} />;
  }
}
