import React from 'react';
import PropTypes from 'prop-types';
import cn from 'astro-classname';

import './index.css';

const propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  containerClassName: PropTypes.string,
};

class CheckboxFormatter extends React.PureComponent {

  static defaultProps = {
    value: false
  }

  render() {
    let { value, containerClassName } = this.props;
    value = value === true ? true : false;
    let classname = cn('dtable-ui cell-formatter-container checkbox-formatter', containerClassName);
    return (
      <div className={classname}>
        <input className="checkbox" type='checkbox' readOnly checked={value}/>
      </div>
    );
  }
}

CheckboxFormatter.propTypes = propTypes;

export default CheckboxFormatter;
