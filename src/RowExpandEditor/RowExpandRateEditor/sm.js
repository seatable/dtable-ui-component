import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class Small extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || '',
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

  onChangeRateNumber = (index) => {
    if (!this.canEdit) return;
    const { value } = this.state;
    const newValue = value === index ? '' : index;
    this.setState({ value: newValue });
    this.props.onCommit(newValue);
  };

  getRateMaxStar = () => {
    const { value } = this.state;
    const { column } = this.props;
    const { rate_max_number, rate_style_color, rate_style_type } = column.data || {};
    const rateShowType = rate_style_type ? rate_style_type : 'dtable-icon-rate';
    let rateList = [];
    for (let i = 0; i < rate_max_number; i++) {
      const rateItemIndex = i + 1;
      const style = {
        color: value >= rateItemIndex ? rate_style_color : '#e5e5e5',
        opacity: 0.4
      };
      const rateItem = (
        <div
          key={i}
          onClick={this.onChangeRateNumber.bind(this, rateItemIndex)}
          style={style}
          className={classnames('mobile-dtable-ui-row-expand-rate-item', { 'rate-item-active': value >= rateItemIndex })}
        >
          <span className={`dtable-font ${rateShowType}`}></span>
        </div>
      );
      rateList.push(rateItem);
    }
    return rateList;
  };

  render() {
    const rateList = this.getRateMaxStar();
    return (
      <div className="mobile-dtable-ui-row-expand-rate-editor dtable-ui dtable-ui-row-expand-rate-editor">
        {rateList}
      </div>
    );
  }
}

Small.propTypes = {
  column: PropTypes.object,
  row: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onCommit: PropTypes.func.isRequired,
};

export default Small;
