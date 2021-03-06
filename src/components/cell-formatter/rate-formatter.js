import React from 'react';
import PropTypes from 'prop-types';
import cn from 'astro-classname';

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
    const { rate_max_number, rate_style_color } = data;
    const validValue = Math.min(rate_max_number, value);
    let rateList = [];
    for (let i = 0; i < validValue; i++) {
      rateList.push(
        <i
          key={`dtable-ui-component-rate-${i}`}
          className="dtable-font dtable-icon-star"
          style={{color: rate_style_color || '#e5e5e5'}}
        >
        </i>
      );
    }
    return rateList;
  }

  render() {
    let { value: number, containerClassName } = this.props;
    let className = cn('dtable-ui cell-formatter-container rate-formatter', containerClassName);
    if (!number) return null;

    let rateList = this.getRateList();
    return (
      <div className={className}>{rateList}</div>
    );
  }
}

RateFormatter.defaultProps = {
  editable: true,
};

RateFormatter.propTypes = propTypes;

export default RateFormatter;
