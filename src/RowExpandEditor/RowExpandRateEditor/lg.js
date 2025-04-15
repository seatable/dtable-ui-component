import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { getLocale } from '../../lang';

class Large extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || '',
      enterRateItemIndex: -1
    };
    let { column } = this.props;
    const { editable } = column;
    this.canEdit = editable;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { column, row, valueKey } = nextProps;
    if (row._id !== this.props.row._id) {
      this.setState({ value: row[column[valueKey]] || '' });
    } else if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value || '' });
    }
  }

  onKeyDown = (event) => {
    event.stopPropagation();
    const { isEditorFocus, column } = this.props;
    if (!isEditorFocus || !this.canEdit) return;
    const { rate_max_number } = column.data || {};
    const currentInputNum = Number(event.key);
    const isValidNumber = currentInputNum <= rate_max_number;
    if (isValidNumber) {
      this.onChangeRateNumber(currentInputNum);
    }
  };

  onChangeRateNumber = (index) => {
    this.props.updateTabIndex(this.props.columnIndex);
    if (!this.canEdit) return;
    const { value } = this.state;
    let newValue = value === index ? '' : index;
    this.setState({ value: newValue });
    this.props.onCommit(newValue);
  };

  onMouseEnterRateItem = (index) => {
    if (this.canEdit) {
      this.setState({ enterRateItemIndex: index });
    }
  };

  onMouseLeaveRateItem = () => {
    if (this.canEdit) {
      this.setState({ enterRateItemIndex: -1 });
    }
  };

  getRateMaxStar = () => {
    const { enterRateItemIndex, value } = this.state;
    const { column } = this.props;
    const { rate_max_number, rate_style_color, rate_style_type } = column.data || {};
    const rateShowType = rate_style_type ? rate_style_type : 'dtable-icon-rate';
    const { editable } = column;
    let rateList = [];
    for (let i = 0; i < rate_max_number; i++) {
      const rateItemIndex = i + 1;
      let itemStyle = {
        cursor: editable ? 'pointer' : 'default',
        color: value >= rateItemIndex ? rate_style_color : '#e5e5e5'
      };
      let style = itemStyle;
      if (enterRateItemIndex >= rateItemIndex) {
        style = {
          ...itemStyle,
          color: rate_style_color,
          opacity: 0.4
        };
      }
      let rateItem = (
        <div
          key={i}
          onMouseEnter={this.onMouseEnterRateItem.bind(this, rateItemIndex)}
          onMouseLeave={this.onMouseLeaveRateItem.bind(this, rateItemIndex)}
          onClick={this.onChangeRateNumber.bind(this, rateItemIndex)}
          style={style}
          className={value >= rateItemIndex ? 'rate-item-active' : ''}
        >
          <span className={`dtable-font ${rateShowType}`}></span>
        </div>);
      rateList.push(rateItem);
    }
    return rateList;
  };

  render() {
    const rateList = this.getRateMaxStar();
    let style = { width: 320 };
    if (this.canEdit && this.props.isEditorFocus) {
      style.boxShadow = 'rgba(70, 127, 207, 0.25) 0px 0px 0px 2px';
      style.borderColor = 'rgb(25, 145, 235)';
    }
    return (
      <div
        tabIndex={0}
        style={style}
        onKeyDown={this.onKeyDown}
        onFocus={this.props.updateTabIndex.bind(this, this.props.columnIndex)}
        aria-label={`${this.state.value}, ${getLocale('Press_the_number_keys_to_enter_the_corresponding_value')}`}
        className={classnames('form-control dtable-ui dtable-ui-row-expand-rate-editor', { 'disabled': !this.canEdit })}
      >
        {rateList}
      </div>
    );
  }
}

Large.propTypes = {
  column: PropTypes.object,
  row: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onCommit: PropTypes.func.isRequired,
  isEditorFocus: PropTypes.bool,
  columnIndex: PropTypes.number,
  updateTabIndex: PropTypes.func.isRequired,
};

export default Large;
