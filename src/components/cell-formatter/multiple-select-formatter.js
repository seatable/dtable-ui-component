import React from 'react';
import PropTypes from 'prop-types';
import cn from 'astro-classname';
import SelectItem from '../common/select-item';

const propTypes = {
  value: PropTypes.array,
  fontSize: PropTypes.number,
  containerClassName: PropTypes.string,
  options: PropTypes.array.isRequired,
};

class MultipleSelectFormatter extends React.PureComponent {

  getOptions = () => {
    let { value, options } = this.props;

    return value.map(item => {
      let option = options.find(option => option.id === item);
      return <SelectItem key={item} option={option}/>;
    })
  }

  render() {
    let { value, containerClassName } = this.props;
    let classname = cn('cell-formatter-container multiple-select-formatter', containerClassName);
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return (<div className={classname}></div>)
    }

    let options = this.getOptions();
    return (
      <div className={classname}>{options}</div>
    );
  }
}

MultipleSelectFormatter.propTypes = propTypes;

export default MultipleSelectFormatter;
