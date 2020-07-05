import React from 'react';
import PropTypes from 'prop-types';
import cn from 'astro-classname';
import SelectItem from '../common/select-item';

const propTypes = {
  value: PropTypes.string,
  containerClassName: PropTypes.string,
  fontSize: PropTypes.number,
  options: PropTypes.array.isRequired,
};

class SingleSelectFormatter extends React.PureComponent {

  getOption = () => {
    let { value, options, fontSize } = this.props;
    let option  = options.find(item => item.id === value);
    return <SelectItem option={option} fontSize={fontSize}/>;
  }

  render() {
    const { containerClassName, value } = this.props;
    let classname = cn('dtable-ui cell-formatter-container single-select-formatter', containerClassName);
    
    if (!value) {
      return (<div className={classname}></div>);
    }

    let option = this.getOption();
    return (
      <div className={classname}>{option}</div>
    );
  }
}

SingleSelectFormatter.propTypes = propTypes;

export default SingleSelectFormatter;
