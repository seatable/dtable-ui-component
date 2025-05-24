/* tslint:disable:jsx-no-multiline-js */
import treeFilter from 'array-tree-filter';
import * as React from 'react';
import RMCCascader from 'rmc-cascader/lib/Cascader';
import RMCPopupCascader from 'rmc-cascader/lib/Popup';
import RMCMultiPicker from 'rmc-picker/lib/MultiPicker';
import RMCPicker from 'rmc-picker/lib/Picker';
import { getComponentLocale } from '../_util/getLocale';

export function getDefaultProps() {
  const defaultFormat = values => {
    // label is JSX.Element or other
    if (values.length > 0 && typeof values[0] !== 'string') {
      return values;
    }
    return values.join(',');
  };
  return {
    triggerType: 'onClick',
    prefixCls: 'am-picker',
    pickerPrefixCls: 'am-picker-col',
    popupPrefixCls: 'am-picker-popup',
    format: defaultFormat,
    cols: 3,
    cascade: true,
    title: ''
  };
}

export default class AbstractPicker extends React.Component {
  getSel = () => {
    const value = this.props.value || [];
    let treeChildren;
    const { data } = this.props;
    if (this.props.cascade) {
      treeChildren = treeFilter(data, (c, level) => {
        return c.value === value[level];
      });
    } else {
      treeChildren = value.map((v, i) => {
        return data[i].filter(d => d.value === v)[0];
      });
    }
    return (
      this.props.format &&
      this.props.format(
        treeChildren.map(v => {
          return v.label;
        })
      )
    );
  };

  getPickerCol = () => {
    const { data, pickerPrefixCls, itemStyle, indicatorStyle } = this.props;
    return data.map((col, index) => {
      return (
        <RMCPicker
          key={index}
          prefixCls={pickerPrefixCls}
          style={{ flex: 1 }}
          itemStyle={itemStyle}
          indicatorStyle={indicatorStyle}
        >
          {col.map(item => {
            return (
              <RMCPicker.Item key={item.value} value={item.value}>
                {item.label}
              </RMCPicker.Item>
            );
          })}
        </RMCPicker>
      );
    });
  };

  onOk = v => {
    if (this.scrollValue !== undefined) {
      v = this.scrollValue;
    }
    if (this.props.onChange) {
      this.props.onChange(v);
    }
    if (this.props.onOk) {
      this.props.onOk(v);
    }
  };

  setScrollValue = v => {
    this.scrollValue = v;
  };

  setCasecadeScrollValue = v => {
    // 级联情况下保证数据正确性，滚动过程中只有当最后一级变化时才变更数据
    if (v && this.scrollValue) {
      const length = this.scrollValue.length;
      if (
        length === v.length &&
        this.scrollValue[length - 1] === v[length - 1]
      ) {
        return;
      }
    }
    this.setScrollValue(v);
  };

  fixOnOk = cascader => {
    if (cascader && cascader.onOk !== this.onOk) {
      cascader.onOk = this.onOk;
      cascader.forceUpdate();
    }
  };

  onPickerChange = v => {
    this.setScrollValue(v);
    if (this.props.onPickerChange) {
      this.props.onPickerChange(v);
    }
  };

  onVisibleChange = visible => {
    this.setScrollValue(undefined);
    if (this.props.onVisibleChange) {
      this.props.onVisibleChange(visible);
    }
  };

  render() {
    const {
      children,
      value = [],
      popupPrefixCls,
      itemStyle,
      indicatorStyle,
      okText,
      dismissText,
      extra,
      cascade,
      prefixCls,
      pickerPrefixCls,
      data,
      cols,
      onOk,
      ...restProps
    } = this.props;

    // tslint:disable-next-line:variable-name
    const _locale = getComponentLocale(this.props, this.context, 'Picker', () =>
      require('./locale/zh_CN')
    );

    let cascader;
    let popupMoreProps = {};
    if (cascade) {
      cascader = (
        <RMCCascader
          prefixCls={prefixCls}
          pickerPrefixCls={pickerPrefixCls}
          data={data}
          cols={cols}
          onChange={this.onPickerChange}
          onScrollChange={this.setCasecadeScrollValue}
          pickerItemStyle={itemStyle}
          indicatorStyle={indicatorStyle}
        />
      );
    } else {
      cascader = (
        <RMCMultiPicker
          style={{ flexDirection: 'row', alignItems: 'center' }}
          prefixCls={prefixCls}
          onScrollChange={this.setScrollValue}
        >
          {this.getPickerCol()}
        </RMCMultiPicker>
      );
      popupMoreProps = {
        pickerValueProp: 'selectedValue',
        pickerValueChangeProp: 'onValueChange'
      };
    }
    return (
      <RMCPopupCascader
        cascader={cascader}
        {...this.popupProps}
        {...restProps}
        prefixCls={popupPrefixCls}
        value={value}
        dismissText={dismissText || _locale.dismissText}
        okText={okText || _locale.okText}
        {...popupMoreProps}
        ref={this.fixOnOk}
        onVisibleChange={this.onVisibleChange}
      >
        {children &&
          typeof children !== 'string' &&
          React.isValidElement(children) &&
          React.cloneElement(children, {
            extra: this.getSel() || extra || _locale.extra
          })}
      </RMCPopupCascader>
    );
  }
}
