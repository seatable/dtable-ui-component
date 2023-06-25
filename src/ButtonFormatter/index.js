import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './index.css';

const propTypes = {
  data: PropTypes.object,
  containerClassName: PropTypes.string,
  optionColors: PropTypes.array,
  onClickButton: PropTypes.func,
};

class ButtonFormatter extends React.Component {

  handleClick = () => {
    if (this.props.onClickButton) {
      this.props.onClickButton(this.props.data);
    }
  }

  render() {
    let { data, containerClassName, optionColors } = this.props;
    const { button_color, button_name } = data || {};
    let colorOption = Array.isArray(optionColors) ?
      (optionColors.find(item => item.COLOR === button_color) || optionColors[0])
      :
      {COLOR: '#FFFCB5', BORDER_COLOR: '#E8E79D', TEXT_COLOR: '#666'};

    const btnStyle = {
      backgroundColor: colorOption.COLOR,
      borderColor: colorOption.BORDER_COLOR,
      color: colorOption.TEXT_COLOR
    };
    return (
      <div>
        <button
          className={classnames('dtable-ui cell-formatter-container button-formatter', containerClassName)}
          style={btnStyle}
          onClick={this.handleClick}
        >
          {button_name}
        </button>
      </div>
    );
  }
}

ButtonFormatter.propTypes = propTypes;

export default ButtonFormatter;
