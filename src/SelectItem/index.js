import React from 'react';
import PropTypes from 'prop-types';

export default class SelectItem extends React.PureComponent {

  static propTypes = {
    option: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    }).isRequired,
    fontSize: PropTypes.number,
  };

  getStyle = (option, fontSize) => {
    return {
      display: 'inline-block',
      padding: '0px 10px',
      marginRight: '8px',
      height: '20px',
      lineHeight: '20px',
      textAlign: 'center',
      borderRadius: '10px',
      maxWidth: '250px',
      fontSize: fontSize ? `${fontSize}px` : '13px',
      backgroundColor: option.color,
      color: option.textColor || null,
    };
  }

  render() {
    let { option, fontSize } = this.props;
    const style = this.getStyle(option, fontSize);
    return (
      <div className="dtable-ui select-item text-truncate" style={style} title={option.name}>{option.name}</div>
    );
  }
}
