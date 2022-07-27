import React from 'react';
import PropTypes from 'prop-types';
import cn from 'astro-classname';

import './index.css';

const propTypes = {
  data: PropTypes.object,
  containerClassName: PropTypes.string,
  optionColors: PropTypes.array,
};

class ButtonFormatter extends React.Component {

  handleClick = () => {
    const { button_type, url_address } = this.props.data;
    if (button_type == 'open_url' && url_address) {
      window.open(url_address);
    }
  }

  render() {
    let { data, containerClassName, optionColors } = this.props;
    const { button_color, button_type, button_name } = data || {};
    if (!button_type) return null;
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
          className={cn('dtable-ui cell-formatter-container button-formatter', containerClassName)}
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
