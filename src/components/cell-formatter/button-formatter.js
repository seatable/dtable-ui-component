import React from 'react';
import PropTypes from 'prop-types';
import cn from 'astro-classname';

const propTypes = {
  data: PropTypes.object,
  containerClassName: PropTypes.string,
  optionColors: PropTypes.array,
};

class ButtonFormatter extends React.Component {

  render() {
    let { data, containerClassName, optionColors } = this.props;
    const { button_color, button_type, button_name } = data || {};
    if (!button_type) return null;
    let colorOption = Array.isArray(optionColors) ?
      (optionColors.find(item => item.COLOR === button_color) || optionColors[0])
      :
      {COLOR: '#FFFCB5', BORDER_COLOR: '#E8E79D', TEXT_COLOR: '#202428'};
    
    const btnStyle = {
      backgroundColor: colorOption.COLOR,
      borderColor: colorOption.BORDER_COLOR,
      color: colorOption.TEXT_COLOR
    };
    return (
      <div className={cn('dtable-ui cell-formatter-container button-formatter', containerClassName)} style={btnStyle}>
        {button_name}
      </div>
    );
  }
}

ButtonFormatter.propTypes = propTypes;

export default ButtonFormatter;
