import React from 'react';
import PropTypes from 'prop-types';
import { UncontrolledTooltip } from 'reactstrap';

const propTypes = {
  editable: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  rateItemIndex: PropTypes.number,
  enterRateItemIndex: PropTypes.number,
  isShowRateItem: PropTypes.bool,
  column: PropTypes.object,
  onMouseEnterRateItem: PropTypes.func,
  onMouseLeaveRateItem: PropTypes.func,
  onChangeRateNumber: PropTypes.func,
};

class RateItem extends React.Component {

  constructor(props) {
    super(props);
    this.tooltipRef = React.createRef();
    this.state = {
      isOpen: false
    };
  }

  onMouseEnterRateItem = () => {
    const { rateItemIndex } = this.props;
    this.props.onMouseEnterRateItem(rateItemIndex);
  }

  onMouseLeaveRateItem = () => {
    this.props.onMouseLeaveRateItem();
  }

  onChangeRateNumber = () => {
    const { onChangeRateNumber, rateItemIndex, editable } = this.props;
    if (onChangeRateNumber && editable) {
      onChangeRateNumber(rateItemIndex);
    }
  }

  render() {
    const { enterRateItemIndex, rateItemIndex, value, column, isShowRateItem, editable } = this.props;
    const { rate_style_color, rate_style_type } = column.data || {};
    const rateShowType = rate_style_type ? rate_style_type : 'dtable-icon-rate';
    if (!isShowRateItem && rateItemIndex > value) return null; 
    let itemStyle = {
      cursor: editable ? 'pointer': 'default',
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

    return (
      <div 
        onMouseEnter={this.onMouseEnterRateItem}
        onMouseLeave={this.onMouseLeaveRateItem}
        style={style}
        onClick={this.onChangeRateNumber}
        className={`rate-item ${value >= rateItemIndex ? 'rate-item-active' : ''}`}
      >
        <span className={`dtable-font ${rateShowType}`} ref={this.tooltipRef}></span>
        {editable && 
          <UncontrolledTooltip 
            placement='bottom' 
            target={this.tooltipRef}
          >
            {rateItemIndex}
          </UncontrolledTooltip>
        }
      </div>
    );
  }
}

RateItem.propTypes = propTypes;

export default RateItem;
