import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  text: PropTypes.string.isRequired,
};

class EditEditorButton extends React.Component {

  getStyle = () => {
    return {
      display: 'inline-block',
      padding: '0 12px',
      height: '28px',
      lineHeight: '28px',
      fontSize: '14px',
      backgroundColor: '#f0f0f0',
      color: '#8f8f8f',
      borderRadius: '4px',
      cursor: 'pointer',
      userSelect: 'none'
    };
  }

  render() {
    let { text } = this.props;
    let style = this.getStyle();
    return (
      <span style={style}>{text}</span>
    );
  }
}

EditEditorButton.propTypes = propTypes;

export default EditEditorButton;
