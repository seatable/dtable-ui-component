import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SelectItem from '../SelectItem';

import './index.css';

const propTypes = {
  value: PropTypes.string,
  containerClassName: PropTypes.string,
  fontSize: PropTypes.number,
  options: PropTypes.array.isRequired,
};

class SingleSelectFormatter extends React.PureComponent {

  static defaultProps = {
    options: [],
  };

  getOption = () => {
    let { value, options, fontSize } = this.props;
    let option  = options.find(item => item.id === value || item.name === value);
    if (option) {
      return <SelectItem option={option} fontSize={fontSize}/>;
    }
  };

  render() {
    const { containerClassName, value } = this.props;
    let classname = classnames('dtable-ui cell-formatter-container single-select-formatter', containerClassName);
    return (
      <div className={classname}>{value ? this.getOption() : ''}</div>
    );
  }
}

SingleSelectFormatter.propTypes = propTypes;

export default SingleSelectFormatter;
