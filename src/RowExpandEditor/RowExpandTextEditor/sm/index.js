import React from 'react';
import PropTypes from 'prop-types';
import SimpleTextEditor from '../../../TextEditor';

import './index.css';

class Small extends React.Component {

  constructor(props) {
    super(props);
    this.editor = null;
  }

  onCommit = () => {
    const value = this.editor.getValue();
    this.props.onCommit(value);
  };

  render() {
    const { readOnly, column, value } = this.props;

    return (
      <div className="mobile-dtable-ui-row-expand-input-editor-container">
        <SimpleTextEditor
          ref={ref => this.editor = ref}
          readOnly={readOnly}
          column={column}
          value={value}
          onCommit={this.onCommit}
        />
      </div>
    );
  }
}

Small.propTypes = {
  readOnly: PropTypes.bool,
  column: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onCommit: PropTypes.func.isRequired,
};

export default Small;
