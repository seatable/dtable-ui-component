import React from 'react';
import PropTypes from 'prop-types';
import cn from 'astro-classname';
import SelectItem from '../SelectItem';

import './index.css';

const propTypes = {
  value: PropTypes.array,
  fontSize: PropTypes.number,
  containerClassName: PropTypes.string,
  options: PropTypes.array.isRequired,
};

class MultipleSelectFormatter extends React.PureComponent {

  getOptions = () => {
    const { value, options } = this.props;
    if (!Array.isArray(value) || !Array.isArray(options)) return [];
    let selectedOptions = options.filter(option => value.includes(option.id) || value.includes(option.name));
    if (selectedOptions.length === 0) return [];
    return selectedOptions.map(option => {
      return <SelectItem key={`multiple-${option.id}`} option={option} />;
    });
  }

  render() {
    let { value, containerClassName } = this.props;
    let classname = cn('dtable-ui cell-formatter-container multiple-select-formatter', containerClassName);
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return (<div className={classname}></div>);
    }

    let options = this.getOptions();
    return (
      <div className={classname}>{options}</div>
    );
  }
}

MultipleSelectFormatter.propTypes = propTypes;

export default MultipleSelectFormatter;
