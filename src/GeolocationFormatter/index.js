import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { getGeolocationDisplayString } from 'dtable-utils';

import './index.css';

const propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  data: PropTypes.object,
  containerClassName: PropTypes.string,
  isBaiduMap: PropTypes.bool,
};

class GeolocationFormatter extends React.Component {

  static defaultProps = {
    value: {
      province: '',
      city: '',
      district: '',
      detail: '',
    },
    data: {},
    containerClassName: '',
    isBaiduMap: false,
  };

  render() {
    let { value, data, containerClassName, isBaiduMap } = this.props;
    let className = classnames('dtable-ui cell-formatter-container geolocation-formatter', containerClassName);

    if (typeof value !== 'object') {
      return null;
    }

    return (
      <div className={className}>
        {getGeolocationDisplayString(value, data, { isBaiduMap, hyphen: ' ' })}
      </div>
    );
  }
}

GeolocationFormatter.propTypes = propTypes;

export default GeolocationFormatter;
