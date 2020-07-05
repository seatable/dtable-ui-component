import React from 'react';
import PropTypes from 'prop-types';
import cn from 'astro-classname';

const propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  containerClassName: PropTypes.string,
};

class CheckboxFormatter extends React.PureComponent {

  static defaultProps = {
    value: false
  }

  getStyle = () => {
    return {
      display: 'inline',
      marginLeft: '0',
      width: '20px',
      height: '20px',
      verticalAlign: 'middle',
      boxShadow: 'none',
      outline: 'none',
      transform: 'scale(1.1)',
    };
  }
    
  render() {
    let { value, containerClassName } = this.props;
    value = value === true ? true : false;
    let style = this.getStyle();
    let classname = cn('dtable-ui cell-formatter-container checkbox-formatter', containerClassName);
    return (
      <div className={classname}>
        <input className="checkbox" type='checkbox' style={style} readOnly checked={value}/>
      </div>
    );
  }
}

CheckboxFormatter.propTypes = propTypes;

export default CheckboxFormatter;
