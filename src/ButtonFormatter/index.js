import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { SELECT_OPTION_COLORS } from 'dtable-utils';

import './index.css';

const propTypes = {
  data: PropTypes.object,
  containerClassName: PropTypes.string,
  onClickButton: PropTypes.func,
};

const WHITE = '#FFFFFF';

class ButtonFormatter extends React.Component {

  handleClick = () => {
    if (this.props.onClickButton) {
      this.props.onClickButton(this.props.data);
    }
  }

  render() {
    let { data, containerClassName } = this.props;
    const { button_color, button_name } = data || {};
    const colorObj = SELECT_OPTION_COLORS.find(item => item.COLOR === button_color) || SELECT_OPTION_COLORS[0];

    const btnStyle = {
      backgroundColor: colorObj.COLOR,
      borderColor: colorObj.BORDER_COLOR,
      color: colorObj.TEXT_COLOR === WHITE ? WHITE : '#666666'
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
