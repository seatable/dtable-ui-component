import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Option extends Component {

  onSelectOption = (value, event) => {
    this.props.onSelectOption(value, event);
  }

  onClick = (event) => {
    if (this.props.supportMultipleSelect) {
      event.stopPropagation();
    }
  }

  onMouseEnter = () => {
    this.props.changeIndex(this.props.index);
  }

  onMouseLeave = () => {
    this.props.changeIndex(-1);
  }

  render() {
    return(
      <div
        className={this.props.isActive ? 'option option-active' : 'option'}
        onMouseDown={this.onSelectOption.bind(this, this.props.value)}
        onClick={this.onClick}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >{this.props.children}</div>
    );
  }
}

Option.propTypes = {
  index: PropTypes.number,
  isActive: PropTypes.bool,
  changeIndex: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  onSelectOption: PropTypes.func,
  supportMultipleSelect: PropTypes.bool
};

export default Option;
