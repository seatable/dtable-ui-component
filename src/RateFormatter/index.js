import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './index.css';

const propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // default cell is string
  data: PropTypes.object,
  containerClassName: PropTypes.string,
};

class RateFormatter extends React.Component {

  static defaultProps = {
    value: '',
    containerClassName: '',
  }

  getRateList = () => {
    const { data, value } = this.props;
    const { rate_max_number = 5, rate_style_color = '#e5e5e5', rate_style_type = 'dtable-icon-rate' } = data || {};
    const validValue = Math.min(rate_max_number, value);
    let rateList = [];
    for (let i = 0; i < validValue; i++) {
      rateList.push(
        <i
          key={`dtable-ui-component-rate-${i}`}
          className={`dtable-font ${rate_style_type}`}
          style={{color: rate_style_color || '#e5e5e5'}}
        >
        </i>
      );
    }
    return rateList;
  }

  render() {
    const { value: number, containerClassName } = this.props;
    const className = classnames('dtable-ui cell-formatter-container rate-formatter', containerClassName);
    if (!number) return null;

    const rateList = this.getRateList();
    return (
      <div className={className}>{rateList}</div>
    );
  }
}

RateFormatter.propTypes = propTypes;

export default RateFormatter;
