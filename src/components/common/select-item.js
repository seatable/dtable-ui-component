import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  option: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  }).isRequired,
};

class SelectItem extends React.PureComponent {

  getStyle = (option) => {
    return {
      display: 'inline-block',
      padding: '0px 10px',
      marginRight: '8px',
      height: '20px',
      lineHeight: '20px',
      textAlign: 'center',
      borderRadius: '10px',
      fontSize: '13px',
      backgroundColor: option.color,
      color: option.textColor || null,
    };
  }

  render() {
    let { option } = this.props;
    const style = this.getStyle(option);

    return (
      <div className="select-item" style={style}>{option.name}</div>
    );
  }
}

SelectItem.propTypes = propTypes;

export default SelectItem;
