import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './index.css';

const propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // default cell is string
  data: PropTypes.object,
  containerClassName: PropTypes.string,
};

class RateExpendRateFormatter extends React.Component {

  static defaultProps = {
    value: '',
    containerClassName: '',
  }

  getRateList = () => {
    const { data, value } = this.props;
    const { rate_max_number = 5, rate_style_color = '#e5e5e5', rate_style_type = 'dtable-icon-rate' } = data || {};
    let rateList = [];
    for (let i = 0; i < rate_max_number; i++) {
      let style = {
        color: value >= i + 1 ? rate_style_color : '#e5e5e5'
      };
      rateList.push(
        <i
          key={`dtable-ui-component-rate-${i}`}
          className={`dtable-font ${rate_style_type}`}
          style={style}
        >
        </i>
      );
    }
    return rateList;
  }

  render() {
    let { containerClassName } = this.props;
    let className = classnames('dtable-ui cell-formatter-container rate-formatter', containerClassName);

    let rateList = this.getRateList();
    return (
      <div className={className}>{rateList}</div>
    );
  }
}

RateExpendRateFormatter.defaultProps = {
  editable: true,
};

RateExpendRateFormatter.propTypes = propTypes;

export default RateExpendRateFormatter;
