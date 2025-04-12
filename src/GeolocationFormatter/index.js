import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { getGeolocationDisplayString } from 'dtable-utils';

import './index.css';

const propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  data: PropTypes.object,
  containerClassName: PropTypes.string,
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
  };

  render() {
    let { value, data, containerClassName } = this.props;
    let className = classnames('dtable-ui cell-formatter-container geolocation-formatter', containerClassName);

    if (typeof value !== 'object') {
      return null;
    }

    const geolocationDisplayString = getGeolocationDisplayString(value, data, { hyphen: ' ' });

    return (
      <div title={geolocationDisplayString} className={className}>
        {geolocationDisplayString}
      </div>
    );
  }
}

GeolocationFormatter.propTypes = propTypes;

export default GeolocationFormatter;
