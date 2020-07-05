import React from 'react';
import PropTypes from 'prop-types';
import cn from 'astro-classname';

const propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
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
    containerClassName: ''
  }

  render() {
    let { value, containerClassName } = this.props;
    let classname = cn('dtable-ui cell-formatter-container geolocation-formatter', containerClassName);

    if (typeof value !== 'object') {
      return null;
    }

    return (
      <div className={classname}>
        {`${value.province || ''} ${value.city || ''} ${value.district || ''} ${value.detail || ''}`}
      </div>
    );
  }
}

GeolocationFormatter.propTypes = propTypes;

export default GeolocationFormatter;
