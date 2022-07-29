import React from 'react';
import PropTypes from 'prop-types';

import './index.css';

const propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func
};

class EditEditorButton extends React.Component {

  render() {
    const { text } = this.props;
    return (
      <span className="dtable-ui-editor-button" onClick={this.props.onClick}>{text}</span>
    );
  }
}

EditEditorButton.propTypes = propTypes;

export default EditEditorButton;
